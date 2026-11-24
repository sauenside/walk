import type { ReactNode } from "react";
import "./resource-page-actions.css";

export const ResourcePageActions = ({ children }: { children: ReactNode }) => (
  <div className="resource-page-actions">{children}</div>
);
