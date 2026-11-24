import { Injectable } from "@nestjs/common";
import { PictureService } from "@/modules/picture";
import { SettingsService } from "@/modules/settings";
import { MediaType, matchesAny, type Category, type DbClient, type Prisma } from "@/shared/database";
import type { BulkFlagsDto, BulkIdsDto } from "@/shared/dto";
import { AppError, assertAllFound } from "@/shared/errors";
import { missingLocalized, type Locale, type LocalizedField } from "@/shared/i18n";
import { resolveMedia } from "@/shared/media";
import { toCursorPage, toPrismaPage } from "@/shared/pagination";
import { CategoryError } from "./category.errors";
import { toClientCategory, toSecretCategory, toSecretFlatCategory, type CategoryTree } from "./category.mapper";
import { CATEGORY_SEARCH_FIELDS, CategoryRepository } from "./category.repository";
import type { CategoryListQuery } from "./dto/category-list-query.dto";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";

const matchesSearch = (category: Category, search: string) => matchesAny(category, CATEGORY_SEARCH_FIELDS, search);

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly pictureService: PictureService,
    private readonly settingsService: SettingsService,
  ) {}

  async list(query: CategoryListQuery) {
    const { view, search, parentId, isActive, isEnabled, mediaType, sortBy, sortOrder } = query;
    const filter = { search, parentId, isActive, isEnabled, mediaType };
    const sort = { sortBy, sortOrder };

    if (view === "flat") {
      const [rows, total] = await this.categoryRepository.findFlatPage(filter, sort, toPrismaPage(query));
      const items = rows.map((row) => toSecretFlatCategory(row, this.pictureService.toView));
      return toCursorPage(items, total, query);
    }

    const [sections, total] = await this.categoryRepository.findTreePage(filter, sort, toPrismaPage(query));

    const items = sections.map((section) =>
      this.toSecret(
        search && !matchesSearch(section, search)
          ? { ...section, children: section.children.filter((child) => matchesSearch(child, search)) }
          : section,
      ),
    );

    return toCursorPage(items, total, query);
  }

  async getMetrics() {
    const { total, roots, available, unavailable, hidden, emoji, picture, none } =
      await this.categoryRepository.countMetrics();
    return { total, roots, status: { available, unavailable, hidden }, media: { emoji, picture, none } };
  }

  listRoots() {
    return this.categoryRepository.findRoots();
  }

  async getById(id: string) {
    return this.toSecret(await this.getExisting(id));
  }

  async create(dto: CreateCategoryDto) {
    this.assertNamesFilled(dto, await this.settingsService.getEnabledLocales());
    const category = await this.categoryRepository.transaction(async (client) => {
      const parentId = dto.parentId ?? null;
      if (parentId) await this.assertParentAvailable(parentId, client);
      await this.assertSlugAvailable(dto.slug, client);

      const media = resolveMedia({
        mediaType: dto.mediaType ?? MediaType.NONE,
        pictureId: dto.pictureId ?? null,
        emoji: dto.emoji ?? null,
      });
      if (media.pictureId) await this.pictureService.assertReady(media.pictureId, "pictureId", client);

      return this.categoryRepository.create(
        {
          ...dto,
          ...media,
          parentId,
          position: dto.position ?? (await this.categoryRepository.getNextPosition(parentId, client)),
        },
        client,
      );
    });
    return this.toSecret(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    // Настройки читаются до транзакции: внутри неё каждый лишний запрос к базе приближает её к таймауту
    const enabledLocales = await this.settingsService.getEnabledLocales();
    const category = await this.categoryRepository.transaction(async (client) => {
      const category = await this.getExisting(id, client);
      this.assertNamesFilled({ ...category, ...dto }, enabledLocales);

      const media = resolveMedia({
        mediaType: dto.mediaType ?? category.mediaType,
        pictureId: dto.pictureId === undefined ? category.pictureId : dto.pictureId,
        emoji: dto.emoji === undefined ? category.emoji : dto.emoji,
      });
      if (media.pictureId && media.pictureId !== category.pictureId) {
        await this.pictureService.assertReady(media.pictureId, "pictureId", client);
      }

      const data: Prisma.CategoryUncheckedUpdateInput = { ...dto, ...media };

      if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
        await this.assertCanMove(category, dto.parentId, client);
        data.position = dto.position ?? (await this.categoryRepository.getNextPosition(dto.parentId, client));
      }

      if (dto.slug !== undefined && dto.slug !== category.slug) await this.assertSlugAvailable(dto.slug, client);

      return this.categoryRepository.update(id, data, client);
    });
    return this.toSecret(category);
  }

  remove(id: string) {
    return this.categoryRepository.transaction(async (client) => {
      const category = await this.getExisting(id, client);
      if (category.children.length > 0) throw CategoryError.hasChildren([id]);
      await this.categoryRepository.delete(id, client);
    });
  }

  bulkUpdate({ ids, isActive, isEnabled }: BulkFlagsDto) {
    return this.categoryRepository.transaction(async (client) => {
      const categories = await this.categoryRepository.findManyWithChildCount(ids, client);
      assertAllFound(ids, categories, CategoryError.notFound);

      const { count } = await this.categoryRepository.updateMany(ids, { isActive, isEnabled }, client);
      return { count };
    });
  }

  bulkDelete({ ids }: BulkIdsDto) {
    return this.categoryRepository.transaction(async (client) => {
      const categories = await this.categoryRepository.findManyWithChildCount(ids, client);
      assertAllFound(ids, categories, CategoryError.notFound);

      const idsWithChildren = categories
        .filter((category) => category._count.children > 0)
        .map((category) => category.id);
      if (idsWithChildren.length > 0) throw CategoryError.hasChildren(idsWithChildren);

      const { count } = await this.categoryRepository.deleteMany(ids, client);
      return { count };
    });
  }

  async listVisible(requested?: Locale) {
    const locale = await this.settingsService.resolveLocale(requested);
    const sections = await this.categoryRepository.findVisibleTree();
    return sections.map((section) => toClientCategory(section, locale, this.pictureService.toView));
  }

  async getVisibleById(id: string, requested?: Locale) {
    const locale = await this.settingsService.resolveLocale(requested);
    const category = await this.categoryRepository.findVisibleById(id);
    if (!category) throw CategoryError.notFound();
    return toClientCategory(category, locale, this.pictureService.toView);
  }

  private toSecret(category: CategoryTree) {
    return toSecretCategory(category, this.pictureService.toView);
  }

  // Название обязательно на каждом включённом языке сайта, на выключенных может быть пустым
  private assertNamesFilled(record: Partial<Record<LocalizedField<"name">, string | null>>, enabledLocales: readonly Locale[]) {
    const missing = missingLocalized(record, "name", enabledLocales);
    if (Object.keys(missing).length > 0) throw AppError.validation(missing);
  }

  private async getExisting(id: string, client?: DbClient) {
    const category = await this.categoryRepository.findById(id, client);
    if (!category) throw CategoryError.notFound();
    return category;
  }

  private async assertParentAvailable(parentId: string, client: DbClient) {
    const parent = await this.categoryRepository.findHierarchyById(parentId, client);
    if (!parent) throw CategoryError.parentNotFound();
    if (parent.parentId) throw CategoryError.depthExceeded("subcategory cannot contain subcategories");
  }

  private async assertCanMove(category: CategoryTree, parentId: string | null, client: DbClient) {
    if (!parentId) return;
    if (parentId === category.id) throw CategoryError.selfParent();
    if (category.children.length > 0) {
      throw CategoryError.depthExceeded("category with subcategories cannot become a subcategory");
    }
    await this.assertParentAvailable(parentId, client);
  }

  private async assertSlugAvailable(slug: string, client: DbClient) {
    if (await this.categoryRepository.existsBySlug(slug, client)) throw CategoryError.slugTaken();
  }
}
