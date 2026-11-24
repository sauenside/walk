import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PROJECT_NAME } from "@/shared/config/project";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { QueryProvider } from "@/shared/providers";
import { LeaveGuardHost } from "@/shared/ui/form/leave-guard";
import { Toaster } from "@/shared/ui/overlays/toast";
import "@/shared/styles/tokens.css";
import "@/shared/styles/base.css";

// Одно название на все страницы
export const metadata: Metadata = {
  title: formatText(PROJECT_NAME, TEXT_CASE.title),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
        <LeaveGuardHost />
      </body>
    </html>
  );
}
