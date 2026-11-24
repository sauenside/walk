import type { InputHTMLAttributes } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText, type TextCase } from "@/shared/lib/formatters";
import { TEXT_BOX_CLASS } from "../text-box";
import "./input.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // Узкое поле с числом справа, например «Позиция»
  compact?: boolean;
  invalid?: boolean;
  // Регистр плейсхолдера; по умолчанию — TEXT_CASE.hint
  textCase?: TextCase;
};

export const Input = ({ compact, invalid, textCase = TEXT_CASE.hint, placeholder, className, ...props }: InputProps) => (
  <input
    className={cx(TEXT_BOX_CLASS, "input", compact && "input-compact", invalid && "is-invalid", className)}
    placeholder={placeholder && formatText(placeholder, textCase)}
    {...props}
  />
);
