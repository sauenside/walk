import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SecretHeader } from "@/widgets/secret/header";
import { SecretSidebar, SidebarToggle } from "@/widgets/secret/sidebar";
import "./secret-layout.css";

// Панель не должна попадать в поисковики: в <head> — <meta name="robots" content="noindex, nofollow">
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Все страницы панели: боковая панель слева; справа шапка, под ней прокручивается страница
export default function SecretLayout({ children }: { children: ReactNode }) {
  return (
    <div className="secret-layout">
      <SecretSidebar />
      <div className="secret-layout-main">
        <SecretHeader start={<SidebarToggle />} />
        <div className="secret-layout-content">{children}</div>
      </div>
    </div>
  );
}
