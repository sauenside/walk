"use client";

import { quote } from "@/shared/lib/formatters";
import type { FiltersStore, FiltersValue } from "@/shared/lib/store-factories";
import { Chip } from "../primitives/chip";
import { ToolbarChips } from "../templates/resource-page";
import type { FilterOption, FilterSectionConfig } from "./filter-sections.config";

type ResourceFilterChipsConfig<F extends FiltersValue> = {
  useStore: FiltersStore<F>;
  sections: FilterSectionConfig<F>[];
  // Сколько записей нашлось; undefined — пока неизвестно
  useTotal: () => number | undefined;
};

// Чипы активных фильтров строятся из тех же разделов, что и меню фильтров
export const createResourceFilterChips = <F extends FiltersValue>({
  useStore,
  sections,
  useTotal,
}: ResourceFilterChipsConfig<F>) => {
  const SectionChip = ({ section }: { section: FilterSectionConfig<F> }) => {
    const value = useStore((state) => state[section.key]) as string;
    const setFilter = useStore((state) => state.setFilter);
    const options: FilterOption[] = section.useOptions();

    if (value === useStore.initial[section.key]) return null;

    const option = options.find((item) => item.value === value);
    const reset = useStore.initial[section.key];

    return (
      <Chip
        onRemove={() => setFilter(section.key, reset as F[typeof section.key])}
      >
        {option?.icon}
        {option?.label ?? section.title}
      </Chip>
    );
  };

  const ResourceFilterChips = () => {
    const value = useStore.useValue();
    const setFilter = useStore((state) => state.setFilter);
    const total = useTotal();

    if (!useStore.isFiltering(value)) return null;

    const search = value.search.trim();

    return (
      <ToolbarChips summary={total === undefined ? undefined : `найдено: ${total}`}>
        {search && (
          <Chip onRemove={() => setFilter("search", "" as F["search"])}>
            {`поиск: ${quote(search)}`}
          </Chip>
        )}
        {sections.map((section) => (
          <SectionChip key={section.key} section={section} />
        ))}
      </ToolbarChips>
    );
  };

  return ResourceFilterChips;
};
