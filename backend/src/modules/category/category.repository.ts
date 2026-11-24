import { Injectable } from "@nestjs/common";
import { PICTURE_REF } from "@/modules/picture";
import {
  containsAny,
  MediaType,
  POSITION_ASC,
  Prisma,
  PrismaService,
  toNextPosition,
  type DbClient,
} from "@/shared/database";
import { localizedFields } from "@/shared/i18n";
import { toStableOrderBy } from "@/shared/pagination";
import type { CategorySortField } from "./dto/category-list-query.dto";

export const CATEGORY_SEARCH_FIELDS = [...localizedFields("name"), "slug"] as const;

export type CategoryFilter = {
  search?: string;
  parentId?: "root" | (string & {});
  isActive?: boolean;
  isEnabled?: boolean;
  mediaType?: MediaType;
};

export type CategorySort = {
  sortBy: CategorySortField;
  sortOrder: Prisma.SortOrder;
};

export type CategoryPage = {
  skip: number;
  take: number;
};

type CategoryMetricsRow = {
  total: number;
  roots: number;
  available: number;
  unavailable: number;
  hidden: number;
  emoji: number;
  picture: number;
  none: number;
};

const ORDER_BY = {
  position: (order) => ({ position: order }),
  name: (order) => ({ nameRu: order }),
  createdAt: (order) => ({ createdAt: order }),
  updatedAt: (order) => ({ updatedAt: order }),
} satisfies Record<CategorySortField, (order: Prisma.SortOrder) => Prisma.CategoryOrderByWithRelationInput>;

const WITH_PICTURE = { picture: PICTURE_REF } satisfies Prisma.CategoryInclude;

// Строка панели: картинка и число подкатегорий
const SECRET_ROW = { ...WITH_PICTURE, _count: { select: { children: true } } } satisfies Prisma.CategoryInclude;

const PARENT_REF = {
  select: { id: true, nameKk: true, nameRu: true, nameEn: true, isActive: true, isEnabled: true },
} satisfies Prisma.CategoryDefaultArgs;

const ALL_CHILDREN = {
  ...SECRET_ROW,
  children: { orderBy: POSITION_ASC, include: SECRET_ROW },
} satisfies Prisma.CategoryInclude;

const VISIBLE_CHILDREN = {
  ...WITH_PICTURE,
  children: { where: { isEnabled: true }, orderBy: POSITION_ASC, include: WITH_PICTURE },
} satisfies Prisma.CategoryInclude;

const ROOT_SELECT = {
  id: true,
  nameKk: true,
  nameRu: true,
  nameEn: true,
  emoji: true,
  isActive: true,
  isEnabled: true,
} satisfies Prisma.CategorySelect;

const toFlagsWhere = (filter: CategoryFilter): Prisma.CategoryWhereInput => ({
  isActive: filter.isActive,
  isEnabled: filter.isEnabled,
  mediaType: filter.mediaType,
});

const toParentWhere = (parentId: CategoryFilter["parentId"]): Prisma.CategoryWhereInput =>
  parentId === undefined ? {} : { parentId: parentId === "root" ? null : parentId };

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(callback: (client: DbClient) => Promise<T>) {
    return this.prisma.$transaction(callback);
  }

  findTreePage(filter: CategoryFilter, sort: CategorySort, page: CategoryPage) {
    const flagsWhere = toFlagsWhere(filter);
    const matchWhere: Prisma.CategoryWhereInput = {
      AND: [flagsWhere, containsAny(CATEGORY_SEARCH_FIELDS, filter.search)],
    };
    const hasMatchFilter = [filter.search, filter.isActive, filter.isEnabled, filter.mediaType].some(
      (value) => value !== undefined,
    );
    const where: Prisma.CategoryWhereInput = {
      parentId: null,
      id: filter.parentId && filter.parentId !== "root" ? filter.parentId : undefined,
      // Prisma считает пустое условие внутри OR ложным, поэтому без фильтров OR не добавляем: нужны все разделы
      ...(hasMatchFilter && { OR: [matchWhere, { children: { some: matchWhere } }] }),
    };
    const orderBy = toStableOrderBy(ORDER_BY[sort.sortBy](sort.sortOrder));

    return this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy,
        include: { ...SECRET_ROW, children: { where: flagsWhere, orderBy, include: SECRET_ROW } },
        ...page,
      }),
      this.prisma.category.count({ where }),
    ]);
  }

  findFlatPage(filter: CategoryFilter, sort: CategorySort, page: CategoryPage) {
    const where: Prisma.CategoryWhereInput = {
      AND: [toFlagsWhere(filter), toParentWhere(filter.parentId), containsAny(CATEGORY_SEARCH_FIELDS, filter.search)],
    };

    return this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy: toStableOrderBy(ORDER_BY[sort.sortBy](sort.sortOrder)),
        include: { ...SECRET_ROW, parent: PARENT_REF },
        ...page,
      }),
      this.prisma.category.count({ where }),
    ]);
  }

  // Все счётчики одним запросом: база далеко, каждое обращение стоит сотни миллисекунд.
  // Статусы как у витрины: isEnabled = false — скрыта, isActive = false — видна, но недоступна
  async countMetrics() {
    const [row] = await this.prisma.$queryRaw<CategoryMetricsRow[]>`
      SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE "parentId" IS NULL)::int AS roots,
        count(*) FILTER (WHERE "isEnabled" AND "isActive")::int AS available,
        count(*) FILTER (WHERE "isEnabled" AND NOT "isActive")::int AS unavailable,
        count(*) FILTER (WHERE NOT "isEnabled")::int AS hidden,
        count(*) FILTER (WHERE "mediaType" = ${MediaType.EMOJI}::"MediaType")::int AS emoji,
        count(*) FILTER (WHERE "mediaType" = ${MediaType.PICTURE}::"MediaType")::int AS picture,
        count(*) FILTER (WHERE "mediaType" = ${MediaType.NONE}::"MediaType")::int AS none
      FROM "Category"
    `;
    return row;
  }

  findRoots() {
    return this.prisma.category.findMany({ where: { parentId: null }, select: ROOT_SELECT, orderBy: POSITION_ASC });
  }

  findById(id: string, client: DbClient = this.prisma) {
    return client.category.findUnique({ where: { id }, include: ALL_CHILDREN });
  }

  findHierarchyById(id: string, client: DbClient = this.prisma) {
    return client.category.findUnique({ where: { id }, select: { id: true, parentId: true } });
  }

  findManyWithChildCount(ids: string[], client: DbClient = this.prisma) {
    return client.category.findMany({
      where: { id: { in: ids } },
      select: { id: true, _count: { select: { children: true } } },
    });
  }

  async existsBySlug(slug: string, client: DbClient = this.prisma) {
    return (await client.category.count({ where: { slug } })) > 0;
  }

  async getNextPosition(parentId: string | null, client: DbClient = this.prisma) {
    const { _max } = await client.category.aggregate({ where: { parentId }, _max: { position: true } });
    return toNextPosition(_max.position);
  }

  create(data: Prisma.CategoryUncheckedCreateInput, client: DbClient = this.prisma) {
    return client.category.create({ data, include: ALL_CHILDREN });
  }

  update(id: string, data: Prisma.CategoryUncheckedUpdateInput, client: DbClient = this.prisma) {
    return client.category.update({ where: { id }, data, include: ALL_CHILDREN });
  }

  delete(id: string, client: DbClient = this.prisma) {
    return client.category.delete({ where: { id } });
  }

  updateMany(ids: string[], data: Prisma.CategoryUpdateManyMutationInput, client: DbClient = this.prisma) {
    return client.category.updateMany({ where: { id: { in: ids } }, data });
  }

  deleteMany(ids: string[], client: DbClient = this.prisma) {
    return client.category.deleteMany({ where: { id: { in: ids } } });
  }

  findVisibleTree() {
    return this.prisma.category.findMany({
      where: { parentId: null, isEnabled: true },
      include: VISIBLE_CHILDREN,
      orderBy: POSITION_ASC,
    });
  }

  findVisibleById(id: string) {
    return this.prisma.category.findFirst({
      where: { id, isEnabled: true, OR: [{ parentId: null }, { parent: { isEnabled: true } }] },
      include: VISIBLE_CHILDREN,
    });
  }
}
