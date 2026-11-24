import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatChildren } from "@/shared/lib/formatters";

export const MenuSection = ({ children }: { children: ReactNode }) => (
  <div className="menu-section">{formatChildren(children, TEXT_CASE.label)}</div>
);
