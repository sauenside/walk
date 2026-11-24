import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import "./field.css";

type FieldProps = {
  label: string;
  // id поля: клик по подписи ставит в него курсор
  htmlFor?: string;
  // Подпись слева, поле справа (например, «позиция»)
  inline?: boolean;
  // Справа от подписи, например выбор языка
  aside?: ReactNode;
  // Пояснение под полем
  hint?: string;
  children: ReactNode;
};

// Подпись, поле и пояснение — без рамок и карточек вокруг.
// Ошибка показывается красной рамкой самого поля, её текст — в уведомлении
export const Field = ({ label, htmlFor, inline, aside, hint, children }: FieldProps) => {
  const text = formatText(label, TEXT_CASE.label);

  return (
    <div className={cx("field", inline && "field-inline")}>
      <div className="field-head">
        {htmlFor ? (
          <label className="field-label" htmlFor={htmlFor}>
            {text}
          </label>
        ) : (
          <div className="field-label">{text}</div>
        )}
        {aside}
      </div>
      {children}
      {hint && <div className="field-hint">{formatText(hint, TEXT_CASE.hint)}</div>}
    </div>
  );
};
