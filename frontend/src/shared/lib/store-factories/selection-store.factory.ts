import { create } from "zustand";

type SelectionState<T extends { id: string }> = {
  // Храним снимок строки, а не только id: «Действия» решают, что доступно, по полям отмеченных записей
  selected: Map<string, T>;
  toggle: (item: T) => void;
  deselect: (ids: string[]) => void;
  clear: () => void;
};

export const createSelectionStore = <T extends { id: string }>() =>
  create<SelectionState<T>>()((set) => ({
    selected: new Map(),
    toggle: (item) =>
      set(({ selected }) => {
        const next = new Map(selected);
        if (next.has(item.id)) next.delete(item.id);
        else next.set(item.id, item);
        return { selected: next };
      }),
    deselect: (ids) =>
      set(({ selected }) => {
        const next = new Map(selected);
        for (const id of ids) next.delete(id);
        return { selected: next };
      }),
    clear: () => set({ selected: new Map() }),
  }));

export type SelectionStore<T extends { id: string }> = ReturnType<typeof createSelectionStore<T>>;
