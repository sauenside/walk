import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarState = {
  // Раскрытые разделы; запоминаются в браузере
  openSections: string[];
  // Панель на десктопе сужена до иконок; запоминается в браузере
  collapsed: boolean;
  // Панель выехала на телефоне; не запоминается
  mobileOpen: boolean;
  toggleSection: (key: string) => void;
  openSection: (key: string) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
};

const STORAGE_KEY = "walk.sidebar";

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      openSections: [],
      collapsed: false,
      mobileOpen: false,
      toggleSection: (key) =>
        set(({ openSections }) => ({
          openSections: openSections.includes(key)
            ? openSections.filter((section) => section !== key)
            : [...openSections, key],
        })),
      openSection: (key) =>
        set(({ openSections }) => (openSections.includes(key) ? {} : { openSections: [...openSections, key] })),
      toggleCollapsed: () => set(({ collapsed }) => ({ collapsed: !collapsed })),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ openSections, collapsed }) => ({ openSections, collapsed }),
      // Сервер не знает, что в браузере: читаем после монтирования, иначе разметка разойдётся с серверной
      skipHydration: true,
    },
  ),
);
