import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/shared/lib/dom";
import "./icon-button.css";

// title запрещён: браузер рисует по нему свою тёмную подсказку, она выбивается из интерфейса
type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> & {
  size?: "md" | "sm";
};

export const IconButton = ({ size = "md", type = "button", className, ...props }: IconButtonProps) => (
  <button
    type={type}
    className={cx("icon-button", size === "sm" && "icon-button-sm", className)}
    {...props}
  />
);
