"use client";

import { useEffect } from "react";
import { create } from "zustand";

// Своё название страницы вместо пункта навигации, со стрелкой назад: например форма категории
type HeaderTitle = { title: string; backHref: string };

const useHeaderStore = create<{ custom: HeaderTitle | null }>()(() => ({ custom: null }));

export const useCustomHeaderTitle = () => useHeaderStore((state) => state.custom);

// Страница задаёт название, пока открыта; title не передан — в шапке название из навигации
export const useHeaderTitle = (title: string | undefined, backHref: string) => {
  useEffect(() => {
    if (!title) return;
    useHeaderStore.setState({ custom: { title, backHref } });
    return () => useHeaderStore.setState({ custom: null });
  }, [title, backHref]);
};
