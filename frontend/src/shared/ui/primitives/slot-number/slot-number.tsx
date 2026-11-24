"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useSlotContext } from "./slot-group";
import { prerenderReelsHtml } from "./slot-prerender";
import "./slot-number.css";

type SlotNumberProps = {
  // Уникален внутри группы: по нему запоминается число цифр
  metricKey: string;
  // null — ошибка или нет значения, undefined — ещё не пришло
  value: number | null | undefined;
};

// Число на барабанах. Барабаны рисует движок группы, React их не трогает
export const SlotNumber = ({ metricKey, value }: SlotNumberProps) => {
  const { engine, loading, reduced } = useSlotContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const reelsRef = useRef<HTMLDivElement>(null);

  // Пока числа нет, барабаны есть уже в серверной разметке и крутятся на CSS до запуска JS.
  // Строка не меняется за всю жизнь числа, поэтому React не перезапишет барабаны движка
  const [prerendered] = useState(() => ({
    __html: value === undefined ? prerenderReelsHtml(metricKey) : "",
  }));

  useLayoutEffect(() => {
    if (reduced || !rootRef.current || !reelsRef.current) return;
    engine.register(metricKey, rootRef.current, reelsRef.current);
    return () => engine.unregister(metricKey);
  }, [engine, metricKey, reduced]);

  useLayoutEffect(() => {
    if (!reduced) engine.setValue(metricKey, value);
  }, [engine, metricKey, value, reduced]);

  // Без анимации движения: прочерк во время загрузки, пришедшее число проявляется по прозрачности
  if (reduced) {
    const shown = loading || value == null ? null : value;

    return (
      <div className="slot-number">
        <div
          key={shown ?? "dash"}
          className={shown === null ? undefined : "slot-fade"}
        >
          {shown ?? "—"}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="slot-number">
      <div
        ref={reelsRef}
        className="slot-reels"
        dangerouslySetInnerHTML={prerendered}
      />
      <div className="slot-dash">—</div>
    </div>
  );
};