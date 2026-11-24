"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "../../overlays/toast";
import { leaveGuard } from "./leave-guard.state";

const TOAST_ID = "leave-guard";

// Ссылка, по которой уходим со страницы внутри сайта; новая вкладка, якорь «#» и та же страница — не уход
const leavingLink = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null;
  }
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.getAttribute("href") === "#") return null;
  if (link.origin !== window.location.origin) return null;
  const href = link.pathname + link.search;
  return href === window.location.pathname + window.location.search ? null : href;
};

// Предупреждение о несохранённых изменениях, пока active.
// Ссылки и «Назад» браузера внутри панели — уведомление с кнопками «уйти» и «остаться» («Назад» ловит LeaveGuardHost).
// Закрытие вкладки и перезагрузка — системное окно браузера: своё там показать нельзя.
// Возвращает confirmLeave для своих кнопок, например «Отмена»
export const useLeaveGuard = (active: boolean) => {
  const router = useRouter();
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(
    () => () => {
      toast.dismiss(TOAST_ID);
      leaveGuard.leaving = false;
    },
    [],
  );

  const confirmLeave = useCallback((leave: () => void) => {
    if (!activeRef.current) return leave();
    toast.warning("есть несохранённые изменения", {
      id: TOAST_ID,
      text: "если уйти, они пропадут",
      duration: 10000,
      urgent: true,
      actions: [
        {
          label: "уйти",
          onClick: () => {
            leaveGuard.leaving = true;
            leave();
          },
        },
        { label: "остаться", onClick: () => undefined },
      ],
    });
  }, []);

  useEffect(() => {
    if (!active) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    // Перехват раньше React: ссылка Next не начнёт переход, пока не выбрали «уйти»
    const onClick = (event: MouseEvent) => {
      const href = leavingLink(event);
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      confirmLeave(() => router.push(href));
    };

    leaveGuard.confirm = confirmLeave;
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      leaveGuard.confirm = null;
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, confirmLeave, router]);

  return confirmLeave;
};
