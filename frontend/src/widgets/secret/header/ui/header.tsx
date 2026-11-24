"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Zap } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { findActive } from "@/shared/config/navigation";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { IconButton } from "@/shared/ui/controls/icon-button";
import { Popover } from "@/shared/ui/overlays/popover";
import { useCustomHeaderTitle } from "../model/header.store";
import "./header.css";

type SecretHeaderProps = {
  // Слева от названия, например кнопка меню на телефоне
  start?: ReactNode;
};

// Название страницы: своё со стрелкой назад, если страница его задала, иначе из навигации с описанием по клику
const HeaderTitle = () => {
  const pathname = usePathname();
  const custom = useCustomHeaderTitle();
  const item = findActive(pathname)?.item;

  if (custom) {
    return (
      <div className="secret-header-back">
        <Link href={custom.backHref} className="secret-header-back-link">
          <ChevronLeft size={ICON_SIZE.large} />
        </Link>
        <div className="secret-header-title">{formatText(custom.title, TEXT_CASE.title)}</div>
      </div>
    );
  }

  const title = item && formatText(item.label, TEXT_CASE.title);

  return item?.description ? (
    // key: на другой странице поповер открывается заново закрытым
    <Popover key={pathname} trigger={title} triggerClassName="secret-header-title">
      {formatText(item.description, TEXT_CASE.hint)}
    </Popover>
  ) : (
    <div className="secret-header-title">{title}</div>
  );
};

// Шапка панели: название текущей страницы. Стоит на месте, страница прокручивается под ней
export const SecretHeader = ({ start }: SecretHeaderProps) => (
  <div className="secret-header">
    <div className="secret-header-inner">
      <div className="secret-header-start">{start}</div>
      <HeaderTitle />
      {/* Место под уведомления: пока пустышка */}
      <IconButton>
        <Zap size={ICON_SIZE.medium} />
      </IconButton>
    </div>
  </div>
);
