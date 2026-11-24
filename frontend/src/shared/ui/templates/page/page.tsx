import type { ReactNode } from "react";
import "./page.css";

// Общий контейнер любой страницы панели: ширина, отступы от краёв и выреза экрана, промежуток между блоками
export const Page = ({ children }: { children: ReactNode }) => <div className="page">{children}</div>;
