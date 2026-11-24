"use client";

import { useEffect } from "react";
import { leaveGuard } from "./leave-guard.state";

// «Назад» браузера при несохранённых изменениях: адрес уже сменился, роутер Next ещё нет — возвращаем адрес и спрашиваем.
// Стоит в корне приложения: эффект регистрирует слушатель раньше роутера Next, и тот не начинает переход
export const LeaveGuardHost = () => {
  useEffect(() => {
    let returning = false;
    const onPopState = (event: PopStateEvent) => {
      const { confirm } = leaveGuard;
      if (!confirm || leaveGuard.leaving) return;
      event.stopImmediatePropagation();
      // Это наш же шаг вперёд, которым вернули адрес
      if (returning) {
        returning = false;
        return;
      }
      returning = true;
      window.history.go(1);
      confirm(() => window.history.back());
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
};
