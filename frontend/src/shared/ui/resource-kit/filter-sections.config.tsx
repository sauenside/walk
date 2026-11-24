import type { ReactNode } from "react";
import { VISIBILITY_LABEL, VISIBILITY_STATUSES, type VisibilityStatus } from "@/shared/lib/visibility";
import type { FiltersValue } from "@/shared/lib/store-factories";
import { VisibilityDot } from "../primitives/visibility-status";

export type FilterOption<V extends string = string> = {
  value: V;
  label: string;
  icon?: ReactNode;
};

type SectionFor<F extends FiltersValue, K extends keyof F & string> = {
  key: K;
  title: string;
  // Хук, а не массив: варианты могут приходить с сервера (например, список корневых категорий)
  useOptions: () => FilterOption<F[K] & string>[];
  // Варианты после этого индекса уходят в прокручиваемый участок
  scrollAfter?: number;
};

// Раздел меню фильтров и чип активного фильтра строятся из одного описания
export type FilterSectionConfig<F extends FiltersValue> = {
  [K in Exclude<keyof F, "search"> & string]: SectionFor<F, K>;
}[Exclude<keyof F, "search"> & string];

// Для разделов с постоянным списком вариантов
export const staticOptions =
  <V extends string>(options: FilterOption<V>[]) =>
  () =>
    options;

const VISIBILITY_OPTIONS: FilterOption<"all" | VisibilityStatus>[] = [
  { value: "all", label: "все" },
  ...VISIBILITY_STATUSES.map((status) => ({
    value: status,
    label: VISIBILITY_LABEL[status],
    icon: <VisibilityDot status={status} />,
  })),
];

// Раздел «Статус» одинаковый для всех ресурсов с видимостью
export const visibilityFilterOptions = staticOptions(VISIBILITY_OPTIONS);
