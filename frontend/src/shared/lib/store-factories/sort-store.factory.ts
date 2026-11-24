import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type SortOrder = "asc" | "desc";

export type SortValue<K extends string> = {
  key: K;
  order: SortOrder;
};

type SortState<K extends string> = SortValue<K> & {
  setKey: (key: K) => void;
  setOrder: (order: SortOrder) => void;
};

export const createSortStore = <K extends string>(initial: SortValue<K>) => {
  const useStore = create<SortState<K>>()((set) => ({
    ...initial,
    setKey: (key) => set({ key }),
    setOrder: (order) => set({ order }),
  }));

  // Только значение сортировки, без лишних перерисовок из-за нового объекта
  const useValue = (): SortValue<K> => useStore(useShallow(({ key, order }) => ({ key, order })));

  return Object.assign(useStore, { useValue });
};

export type SortStore<K extends string> = ReturnType<typeof createSortStore<K>>;
