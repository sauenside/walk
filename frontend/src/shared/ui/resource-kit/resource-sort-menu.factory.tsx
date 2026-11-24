"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import type { SortStore } from "@/shared/lib/store-factories";
import { Dropdown, MenuItem, MenuSection, MenuSeparator } from "../overlays/dropdown";

type ResourceSortMenuConfig<K extends string> = {
  useStore: SortStore<K>;
  options: { value: K; label: string }[];
};

export const createResourceSortMenu = <K extends string>({ useStore, options }: ResourceSortMenuConfig<K>) => {
  const ResourceSortMenu = () => {
    const { key, order, setKey, setOrder } = useStore();

    return (
      <Dropdown label={options.find((option) => option.value === key)?.label} icon={<ArrowUpDown size={ICON_SIZE.medium} />}>
        {(close) => (
          <>
            <MenuSection>сортировать по</MenuSection>
            {options.map((option) => (
              <MenuItem
                key={option.value}
                checked={key === option.value}
                onClick={() => {
                  setKey(option.value);
                  close();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem
              checked={order === "asc"}
              onClick={() => {
                setOrder("asc");
                close();
              }}
            >
              <ArrowUp size={ICON_SIZE.small} />
              по возрастанию
            </MenuItem>
            <MenuItem
              checked={order === "desc"}
              onClick={() => {
                setOrder("desc");
                close();
              }}
            >
              <ArrowDown size={ICON_SIZE.small} />
              по убыванию
            </MenuItem>
          </>
        )}
      </Dropdown>
    );
  };

  return ResourceSortMenu;
};
