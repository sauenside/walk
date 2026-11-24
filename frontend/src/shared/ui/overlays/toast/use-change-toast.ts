"use client";

import { useEffect, useRef } from "react";
import { toast } from "./toast";

// Предупреждение о состоянии на экране, например «Родитель скрыт»: показывается, когда текст появился
// или изменился, и убирается, когда условие ушло. Первое значение не показывается — только что открытая
// форма не должна сразу сыпать уведомлениями. Компонент ушёл — уведомление тоже
export const useChangeToast = (id: string, message: string | undefined) => {
  const previous = useRef(message);

  useEffect(() => {
    if (message === previous.current) return;
    previous.current = message;
    if (message) toast.warning(message, { id });
    else toast.dismiss(id);
  }, [id, message]);

  useEffect(() => () => toast.dismiss(id), [id]);
};
