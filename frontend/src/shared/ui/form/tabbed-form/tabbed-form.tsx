"use client";

import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatChildren } from "@/shared/lib/formatters";
import { Button } from "../../controls/button";
import { Tabs } from "../../navigation/tabs";
import type { TabbedFormController } from "./use-tabbed-form";
import "./tabbed-form.css";

type TabbedFormProps<TTab extends string> = {
  controller: TabbedFormController<TTab>;
  // Строка над вкладками: картинка, название записи и пояснение; без title её нет (например, настройки)
  title?: ReactNode;
  subtitle?: ReactNode;
  media?: ReactNode;
  submitLabel: string;
  onCancel: () => void;
  // Содержимое каждой вкладки. Смонтированы все сразу, видна открытая: если поле размонтировать,
  // TanStack Form теряет его ошибки, и ошибка с другой вкладки пропала бы при переходе на неё
  panels: Partial<Record<TTab, ReactNode>>;
};

// Форма на странице: строка с картинкой и названием, вкладки, белая карточка вкладки,
// внизу панель с кнопками, прижатая к низу экрана. Ошибки — в уведомлениях
export const TabbedForm = <TTab extends string>({
  controller,
  title,
  subtitle,
  media,
  submitLabel,
  onCancel,
  panels,
}: TabbedFormProps<TTab>) => {
  const { tab, setTab, tabs, submit, saving } = controller;

  return (
    <form className="tabbed-form" onSubmit={submit}>
      {title && (
        <div className="tabbed-form-head">
          {media}
          <div className="tabbed-form-heading">
            <div className="tabbed-form-title">{formatChildren(title, TEXT_CASE.title)}</div>
            {subtitle && <div className="tabbed-form-subtitle">{formatChildren(subtitle, TEXT_CASE.hint)}</div>}
          </div>
        </div>
      )}

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tabs.map((item) => (
        <div key={item.value} className="tabbed-form-panel" hidden={item.value !== tab}>
          {panels[item.value]}
        </div>
      ))}

      <div className="tabbed-form-footer">
        <Button onClick={onCancel}>отмена</Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
