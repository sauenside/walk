"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { SlotEngine } from "./slot-engine";

type SlotContextValue = {
  engine: SlotEngine;
  loading: boolean;
  reduced: boolean;
};

const SlotContext = createContext<SlotContextValue | null>(null);

export const useSlotContext = () => {
  const context = useContext(SlotContext);
  if (!context) throw new Error("SlotNumber должен быть внутри SlotGroup");
  return context;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

type SlotGroupProps = {
  // Префикс ключей в localStorage, например "secret.categories"
  scope: string;
  // Запрос отправлен и ответа ещё нет
  loading: boolean;
  children: ReactNode;
};

// Числа внутри группы крутятся вместе и встают одной волной слева направо
export const SlotGroup = ({ scope, loading, children }: SlotGroupProps) => {
  const [engine] = useState(() => new SlotEngine(scope));
  const reduced = useReducedMotion();
  const requestId = useRef(0);

  useEffect(() => () => engine.destroy(), [engine]);

  // Эффекты детей уже отработали: значения чисел в движке актуальны
  useEffect(() => {
    if (reduced) return;
    if (loading) requestId.current = engine.load();
    else engine.settle(requestId.current);
  }, [engine, loading, reduced]);

  return <SlotContext.Provider value={{ engine, loading, reduced }}>{children}</SlotContext.Provider>;
};
