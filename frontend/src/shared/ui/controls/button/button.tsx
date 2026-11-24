import type { ButtonHTMLAttributes } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatChildren, type TextCase } from "@/shared/lib/formatters";
import "./button.css";

// title запрещён: браузер рисует по нему свою тёмную подсказку, она выбивается из интерфейса
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
  variant?: "default" | "primary" | "danger";
  size?: "md" | "sm";
  // Свой регистр для этой кнопки; по умолчанию — TEXT_CASE.button
  textCase?: TextCase;
};

export const Button = ({
  variant = "default",
  size = "md",
  type = "button",
  className,
  textCase = TEXT_CASE.button,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cx("button", variant !== "default" && `button-${variant}`, size === "sm" && "button-sm", className)}
    {...props}
  >
    {formatChildren(children, textCase)}
  </button>
);
