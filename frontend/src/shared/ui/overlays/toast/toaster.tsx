"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import { Button } from "../../controls/button";
import { IconButton } from "../../controls/icon-button";
import { useToastStore, type ToastItem, type ToastTone } from "./toast.store";
import "./toast.css";

const ICONS: Record<ToastTone, typeof Info> = {
  error: CircleAlert,
  warning: TriangleAlert,
  success: CircleCheck,
  info: Info,
};

// Капсула в начале и в конце: круг 40px, из него вырастает уведомление и в него же сжимается
const COLLAPSED = 40;

// Сколько длится сжатие перед тем, как капсула исчезнет; совпадает с transition в toast.css
const CLOSE_MS = 450;

// Шире не растёт; на узком экране — ширина слоя уведомлений
const MAX_WIDTH = 420;

// Рамка капсулы: размер содержимого + 1px с каждой стороны
const BORDER = 2;

type Size = { width: number; height: number };

const IslandContent = ({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) => {
  const Icon = ICONS[toast.tone];

  return (
    <>
      <div className={cx("island-icon", `island-icon-${toast.tone}`)}>
        <Icon size={ICON_SIZE.medium} />
      </div>
      <div className="island-text">
        <div className="island-title">{formatText(toast.title, TEXT_CASE.toast)}</div>
        {toast.text && <div className="island-note">{formatText(toast.text, TEXT_CASE.toast)}</div>}
        {toast.items && toast.items.length > 0 && (
          <div className="island-items">
            {toast.items.map((item, index) => (
              <div key={index} className="island-item">
                {formatText(item, TEXT_CASE.toast)}
              </div>
            ))}
          </div>
        )}
        {toast.actions && toast.actions.length > 0 && (
          <div className="island-actions">
            {toast.actions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                onClick={() => {
                  action.onClick();
                  onDismiss();
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      <IconButton size="sm" className="island-close" onClick={onDismiss}>
        <X size={ICON_SIZE.small} />
      </IconButton>
    </>
  );
};

// Уведомления в одной капсуле сверху по центру. Показывается одно за раз: следующее ждёт в очереди,
// а капсула перетекает в его размер. Появляется из круга и сжимается в него же
export const Toaster = () => {
  const current = useToastStore((state) => state.toasts[0]);
  const dismiss = useToastStore((state) => state.dismiss);

  // shown держит содержимое, пока капсула сжимается после последнего уведомления
  const [shown, setShown] = useState<ToastItem | null>(null);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<Size | null>(null);
  const [maxWidth, setMaxWidth] = useState(MAX_WIDTH);
  const [paused, setPaused] = useState(false);
  const observer = useRef<ResizeObserver | null>(null);

  // Пришло уведомление — показываем; очередь опустела — сжимаем и убираем после анимации
  useEffect(() => {
    if (current) {
      setShown(current);
      return;
    }
    setOpen(false);
    setPaused(false);
    const timer = setTimeout(() => setShown(null), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [current]);

  // Раскрываем кадром позже: сначала браузер рисует круг, потом размер растёт до содержимого
  useEffect(() => {
    if (!current || open) return;
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [current, open]);

  // Время показа идёт, только пока уведомление раскрыто и курсор не на нём; повтор с тем же id — заново
  useEffect(() => {
    if (!current || !open || paused) return;
    const timer = setTimeout(() => dismiss(current.id), current.duration);
    return () => clearTimeout(timer);
  }, [current, open, paused, dismiss]);

  // Размер содержимого: под него капсула меняет ширину и высоту
  const contentRef = useCallback((element: HTMLDivElement | null) => {
    observer.current?.disconnect();
    if (!element) return;
    const measure = () => setSize({ width: element.offsetWidth + BORDER, height: element.offsetHeight + BORDER });
    observer.current = new ResizeObserver(measure);
    observer.current.observe(element);
    measure();
  }, []);

  // Ширина слоя: на телефоне капсула не шире экрана
  const toasterRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    const measure = () => setMaxWidth(Math.min(MAX_WIDTH, element.clientWidth));
    new ResizeObserver(measure).observe(element);
    measure();
  }, []);

  const islandSize = open && size ? size : { width: COLLAPSED, height: COLLAPSED };

  return (
    <div ref={toasterRef} className="toaster">
      {shown && (
        <div
          className={cx("island", open && "is-open")}
          style={islandSize}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* key: новое уведомление — новое содержимое, оно проявляется, пока капсула меняет размер */}
          <div key={`${shown.id}:${shown.version}`} ref={contentRef} className="island-content" style={{ maxWidth }}>
            <IslandContent toast={shown} onDismiss={() => dismiss(shown.id)} />
          </div>
        </div>
      )}
    </div>
  );
};
