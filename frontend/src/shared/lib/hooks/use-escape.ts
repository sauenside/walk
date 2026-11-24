import { useEffect, useRef } from "react";

type UseEscapeOptions = {
  enabled?: boolean;
  // Захват срабатывает раньше остальных и останавливает событие:
  // так Esc закрывает верхний слой (меню), а не то, что под ним (окно)
  capture?: boolean;
};

export const useEscape = (handler: () => void, { enabled = true, capture = false }: UseEscapeOptions = {}) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const target = capture ? document : window;
    const onKey = (event: Event) => {
      if ((event as KeyboardEvent).key !== "Escape") return;
      if (capture) event.stopPropagation();
      handlerRef.current();
    };
    target.addEventListener("keydown", onKey, capture);
    return () => target.removeEventListener("keydown", onKey, capture);
  }, [enabled, capture]);
};
