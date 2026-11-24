import { create } from "zustand";
import { toggleInSet } from "@/shared/lib/collections";

type ExpandedStore = {
  // id раскрытых корневых категорий
  expanded: Set<string>;
  toggle: (id: string) => void;
  setAll: (ids: string[], open: boolean) => void;
};

// Отдельное хранилище, чтобы колонки таблицы были постоянными, а ячейка сама переключала группу
export const useCategoryExpanded = create<ExpandedStore>()((set) => ({
  expanded: new Set(),
  toggle: (id) => set(({ expanded }) => ({ expanded: toggleInSet(expanded, id) })),
  setAll: (ids, open) =>
    set(({ expanded }) => {
      const next = new Set(expanded);
      for (const id of ids) {
        if (open) next.add(id);
        else next.delete(id);
      }
      return { expanded: next };
    }),
}));
