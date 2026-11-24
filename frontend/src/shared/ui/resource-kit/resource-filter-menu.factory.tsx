"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import type { FiltersStore, FiltersValue } from "@/shared/lib/store-factories";
import { Dropdown, MenuItem, MenuScroll, MenuSeparator } from "../overlays/dropdown";
import { FilterSection } from "../overlays/filter-section";
import type { FilterOption, FilterSectionConfig } from "./filter-sections.config";
import "./resource-kit.css";

type ResourceFilterMenuConfig<F extends FiltersValue> = {
  useStore: FiltersStore<F>;
  sections: FilterSectionConfig<F>[];
};

export const createResourceFilterMenu = <F extends FiltersValue>({ useStore, sections }: ResourceFilterMenuConfig<F>) => {
  type Props = {
    section: FilterSectionConfig<F>;
    open: boolean;
    onToggle: () => void;
  };

  const Section = ({ section, open, onToggle }: Props) => {
    const value = useStore((state) => state[section.key]) as string;
    const setFilter = useStore((state) => state.setFilter);
    const options: FilterOption[] = section.useOptions();
    const split = section.scrollAfter ?? options.length;

    const renderOption = (option: FilterOption) => (
      <MenuItem
        key={option.value}
        checked={value === option.value}
        onClick={() => setFilter(section.key, option.value as F[typeof section.key])}
      >
        {option.icon}
        {option.label}
      </MenuItem>
    );

    return (
      <FilterSection
        title={section.title}
        value={options.find((option) => option.value === value)?.label ?? ""}
        open={open}
        onToggle={onToggle}
      >
        {options.slice(0, split).map(renderOption)}
        {split < options.length && <MenuScroll>{options.slice(split).map(renderOption)}</MenuScroll>}
      </FilterSection>
    );
  };

  const Menu = () => {
    const value = useStore.useValue();
    const resetFilters = useStore((state) => state.resetFilters);
    // Раскрыт только один раздел, чтобы меню оставалось коротким
    const [openKey, setOpenKey] = useState<string | null>(null);

    return (
      <div className="resource-filter-menu">
        {sections.map((section) => (
          <Section
            key={section.key}
            section={section}
            open={openKey === section.key}
            onToggle={() => setOpenKey((current) => (current === section.key ? null : section.key))}
          />
        ))}
        {useStore.countActive(value) > 0 && (
          <>
            <MenuSeparator />
            <button type="button" className="resource-filter-reset" onClick={resetFilters}>
              {formatText("сбросить фильтры", TEXT_CASE.button)}
            </button>
          </>
        )}
      </div>
    );
  };

  const ResourceFilterMenu = () => {
    const value = useStore.useValue();

    return (
      <Dropdown label="фильтры" icon={<SlidersHorizontal size={ICON_SIZE.medium} />} badge={useStore.countActive(value)} align="end">
        {() => <Menu />}
      </Dropdown>
    );
  };

  return ResourceFilterMenu;
};
