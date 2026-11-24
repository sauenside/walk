import type { TextareaHTMLAttributes } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText, type TextCase } from "@/shared/lib/formatters";
import { TEXT_BOX_CLASS } from "../text-box";
import "./textarea.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  // Регистр плейсхолдера; по умолчанию — TEXT_CASE.hint
  textCase?: TextCase;
};

export const Textarea = ({ invalid, textCase = TEXT_CASE.hint, placeholder, className, ...props }: TextareaProps) => (
  <textarea
    className={cx(TEXT_BOX_CLASS, "textarea", invalid && "is-invalid", className)}
    placeholder={placeholder && formatText(placeholder, textCase)}
    {...props}
  />
);
