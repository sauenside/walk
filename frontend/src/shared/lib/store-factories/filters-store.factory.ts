import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

// Поиск обязателен; остальные фильтры — строки, где начальное значение означает «не выбрано»
export type FiltersValue = { search: string } & Record<string, string>;

type FiltersState<F extends FiltersValue> = F & {
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void;
  // Сбрасывает фильтры, но оставляет поиск
  resetFilters: () => void;
  resetAll: () => void;
};

export const createFiltersStore = <F extends FiltersValue>(initial: F) => {
  const keys = Object.keys(initial) as (keyof F)[];

  // Частичное состояние для set: значения фильтров приходят обобщённым F, поэтому приведение через unknown
  type Patch = Partial<FiltersState<F>>;

  const useStore = create<FiltersState<F>>()(
    (set) =>
      ({
        ...initial,
        setFilter: (key, value) => set({ [key]: value } as unknown as Patch),
        resetFilters: () => set(({ search }) => ({ ...initial, search }) as unknown as Patch),
        resetAll: () => set(initial as unknown as Patch),
      }) as FiltersState<F>,
  );

  // Только значения фильтров, без функций; useShallow не даёт лишних перерисовок
  const useValue = (): F =>
    useStore(useShallow((state) => Object.fromEntries(keys.map((key) => [key, state[key]])) as unknown as F));

  // Сколько фильтров выбрано, не считая поиска
  const countActive = (value: F) =>
    keys.filter((key) => key !== "search" && value[key] !== initial[key]).length;

  // Есть поиск или хотя бы один фильтр
  const isFiltering = (value: F) => value.search.trim() !== "" || countActive(value) > 0;

  return Object.assign(useStore, { useValue, countActive, isFiltering, initial });
};

export type FiltersStore<F extends FiltersValue> = ReturnType<typeof createFiltersStore<F>>;
