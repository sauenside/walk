import type { Visibility } from "./visibility.schema";
import type { VisibilityStatus } from "./visibility.config";

export const getVisibility = ({ isActive, isEnabled }: Visibility): VisibilityStatus =>
  !isEnabled ? "hidden" : !isActive ? "unavailable" : "available";

// Обратное преобразование для фильтра списка: статус → флаги в запросе к API
export const visibilityToFlags = (status: VisibilityStatus): Partial<Visibility> => {
  if (status === "hidden") return { isEnabled: false };
  if (status === "unavailable") return { isEnabled: true, isActive: false };
  return { isEnabled: true, isActive: true };
};
