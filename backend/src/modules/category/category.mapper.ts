import type { PictureRef, PictureView } from "@/modules/picture";
import type { Category } from "@/shared/database";
import { pickLocalized, pickLocalizedOrAny, type Locale } from "@/shared/i18n";

type CategoryWithPicture = Category & { picture: PictureRef | null };

type SecretCategoryRow = CategoryWithPicture & { _count: { children: number } };

type CategoryParentRef = Pick<Category, "id" | "nameKk" | "nameRu" | "nameEn" | "isActive" | "isEnabled">;

export type CategoryTree = SecretCategoryRow & { children: SecretCategoryRow[] };

export type CategoryFlatRow = SecretCategoryRow & { parent: CategoryParentRef | null };

export type ClientCategoryTree = CategoryWithPicture & { children: CategoryWithPicture[] };

type ToPictureView = (picture: PictureRef | null) => PictureView | null;

const toSecretCategoryFields = ({ picture, _count, ...category }: SecretCategoryRow, toPicture: ToPictureView) => ({
  ...category,
  picture: toPicture(picture),
  childrenCount: _count.children,
});

export const toSecretCategory = ({ children, ...category }: CategoryTree, toPicture: ToPictureView) => ({
  ...toSecretCategoryFields(category, toPicture),
  children: children.map((child) => toSecretCategoryFields(child, toPicture)),
});

// Строка плоского списка: вместо детей — родитель для пути «Раздел ›»
export const toSecretFlatCategory = ({ parent, ...category }: CategoryFlatRow, toPicture: ToPictureView) => ({
  ...toSecretCategoryFields(category, toPicture),
  parent,
});

const toClientCategoryFields = (category: CategoryWithPicture, locale: Locale, toPicture: ToPictureView) => ({
  id: category.id,
  parentId: category.parentId,
  slug: category.slug,
  // Название на выключенном раньше языке могло остаться пустым
  name: pickLocalizedOrAny(category, "name", locale),
  description: pickLocalized(category, "description", locale),
  isActive: category.isActive,
  mediaType: category.mediaType,
  picture: toPicture(category.picture),
  emoji: category.emoji,
});

export const toClientCategory = (category: ClientCategoryTree, locale: Locale, toPicture: ToPictureView) => ({
  ...toClientCategoryFields(category, locale, toPicture),
  children: category.children.map((child) => toClientCategoryFields(child, locale, toPicture)),
});
