import { useToastStore, type ToastAction, type ToastTone } from "./toast.store";

export type ToastOptions = {
  // Повторный показ с тем же id заменяет уведомление, а не добавляет ещё одно
  id?: string;
  text?: string;
  items?: string[];
  actions?: ToastAction[];
  duration?: number;
  // Показать сразу, не дожидаясь очереди: например вопрос перед уходом со страницы
  urgent?: boolean;
};

// Сколько уведомление висит, мс; наведение или фокус останавливают отсчёт
const DURATION: Record<ToastTone, number> = {
  error: 5000,
  warning: 5000,
  success: 3000,
  info: 4000,
};

// На каждую строку списка — ещё секунда, чтобы успеть прочитать
const PER_ITEM = 1000;

let counter = 0;

const show =
  (tone: ToastTone) =>
  (title: string, { id = `toast-${++counter}`, text, items, actions, duration, urgent }: ToastOptions = {}) => {
    useToastStore.getState().show({
      id,
      tone,
      title,
      text,
      items,
      actions,
      duration: duration ?? DURATION[tone] + (items?.length ?? 0) * PER_ITEM,
    }, urgent);
    return id;
  };

// Вызывается откуда угодно, не только из компонентов: из обработчиков, мутаций, кэша запросов
export const toast = {
  error: show("error"),
  warning: show("warning"),
  success: show("success"),
  info: show("info"),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
};
