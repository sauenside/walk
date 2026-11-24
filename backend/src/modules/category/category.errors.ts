import { AppError, toIdFields } from "@/shared/errors";

export const CategoryError = {
  notFound: (ids?: string[]) =>
    AppError.notFound("category not found", "CATEGORY_NOT_FOUND", ids && toIdFields(ids, "not found")),

  parentNotFound: () => AppError.validation({ parentId: "category not found" }),

  selfParent: () => AppError.validation({ parentId: "category cannot be its own parent" }),

  slugTaken: () => AppError.conflict("slug already taken", "CATEGORY_SLUG_TAKEN", { slug: "already taken" }),

  depthExceeded: (message: string) => AppError.conflict(message, "CATEGORY_DEPTH_EXCEEDED"),

  hasChildren: (ids: string[]) =>
    AppError.conflict("category has subcategories", "CATEGORY_HAS_CHILDREN", toIdFields(ids, "has subcategories")),
};
