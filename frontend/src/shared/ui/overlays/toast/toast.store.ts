import { create } from "zustand";

export type ToastTone = "error" | "warning" | "success" | "info";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastItem = {
  id: string;
  tone: ToastTone;
  title: string;
  // Пояснение под заголовком
  text?: string;
  // Список под заголовком, например поля с ошибками
  items?: string[];
  // Кнопки под текстом; любая закрывает уведомление после своего действия
  actions?: ToastAction[];
  duration: number;
  // Растёт при повторном показе с тем же id: таймер начинается заново
  version: number;
};

type ToastState = {
  toasts: ToastItem[];
  // urgent — показать сразу, текущее уведомление подождёт в очереди
  show: (toast: Omit<ToastItem, "version">, urgent?: boolean) => void;
  dismiss: (id: string) => void;
};

// Больше не помещается без прокрутки: самые старые уходят
const MAX_TOASTS = 4;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  // Тот же id — обновляем на месте, а не добавляем ещё один
  show: (toast, urgent = false) =>
    set(({ toasts }) => {
      const existing = toasts.find((item) => item.id === toast.id);
      if (existing) {
        return { toasts: toasts.map((item) => (item.id === toast.id ? { ...toast, version: existing.version + 1 } : item)) };
      }
      const added = { ...toast, version: 0 };
      return { toasts: urgent ? [added, ...toasts].slice(0, MAX_TOASTS) : [...toasts, added].slice(-MAX_TOASTS) };
    }),

  dismiss: (id) => set(({ toasts }) => ({ toasts: toasts.filter((item) => item.id !== id) })),
}));
