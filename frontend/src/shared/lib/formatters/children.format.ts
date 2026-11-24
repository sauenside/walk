import { Children, type ReactNode } from "react";
import { formatText, type TextCase } from "./text.format";

// Стили, которые касаются только начала фразы: их применяем к первой строке, а не к каждой
const SENTENCE_START: TextCase[] = ["capitalize", "sentence"];

// formatText для содержимого компонента: меняет только строки, иконки и другие элементы не трогает.
// <Button><Plus /> создать</Button> с "capitalize" → <Plus /> Создать.
// Для capitalize и sentence меняется только первая строка: данные посреди фразы остаются как есть
export const formatChildren = (children: ReactNode, style: TextCase): ReactNode => {
  if (style === "none") return children;
  if (typeof children === "string") return formatText(children, style);
  if (!Array.isArray(children)) return children;
  let formatted = false;
  return Children.map(children, (child) => {
    if (typeof child !== "string" || (formatted && SENTENCE_START.includes(style))) return child;
    formatted = true;
    return formatText(child, style);
  });
};
