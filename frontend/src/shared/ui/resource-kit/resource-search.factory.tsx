"use client";

import type { FiltersStore, FiltersValue } from "@/shared/lib/store-factories";
import { SearchField } from "../controls/search-field";

type ResourceSearchConfig<F extends FiltersValue> = {
  useStore: FiltersStore<F>;
  id: string;
  placeholder: string;
};

// Поиск, привязанный к хранилищу фильтров ресурса
export const createResourceSearch = <F extends FiltersValue>({ useStore, id, placeholder }: ResourceSearchConfig<F>) => {
  const ResourceSearch = () => {
    const search = useStore((state) => state.search);
    const setFilter = useStore((state) => state.setFilter);
    return (
      <SearchField
        id={id}
        value={search}
        placeholder={placeholder}
        onChange={(value) => setFilter("search", value as F["search"])}
      />
    );
  };

  return ResourceSearch;
};
