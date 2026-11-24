"use client";

import { useEffect, useId, useState, type SubmitEvent } from "react";
import { getApiErrorMessage, type ApiErrorMessages } from "@/shared/api/schemas";
import { fieldError, type AnyForm, type FieldErrors } from "@/shared/lib/form";
import type { TabItem } from "../../navigation/tabs";
import { toast } from "../../overlays/toast";

type UseTabbedFormOptions<TValues, TTab extends string, TResult> = {
  form: AnyForm;
  // Вкладки, которые видны сейчас (например, «Информация» только при изменении)
  tabs: ReadonlyArray<Omit<TabItem<TTab>, "warning">>;
  initialTab: TTab;
  // Оранжевая точка на вкладке, где что-то не заполнено
  warnings: Partial<Record<TTab, boolean>>;
  // Поле формы → вкладка: туда переключаемся, если сервер отклонил поле
  fieldTab: Partial<Record<keyof TValues & string, TTab>>;
  // Подписи полей для уведомления об ошибках, в порядке формы: «название қазақша: введите название»
  fieldLabels: Partial<Record<keyof TValues & string, string>>;
  serverErrors: (error: unknown) => FieldErrors<keyof TValues & string>;
  errorMessages?: ApiErrorMessages;
  // Уведомление после сохранения, например «Категория «Кофе» создана»
  savedMessage: string;
  // Создание или изменение — решает сущность
  save: (values: TValues) => Promise<TResult>;
  // Получает то, что вернуло сохранение, например созданную запись
  onSaved: (result: TResult) => void;
};

// Одна строка — пояснением, несколько — списком
const toastBody = (lines: string[]) => (lines.length === 1 ? { text: lines[0] } : { items: lines });

// Механика формы записи с вкладками: точки на вкладках, проверка, сохранение, ошибки сервера у полей.
// Тексты ошибок уходят в уведомления, у полей остаётся красная рамка.
// Не знает, где стоит форма и что делать после сохранения: это решает страница
export const useTabbedForm = <TValues, TTab extends string, TResult>({
  form,
  tabs,
  initialTab,
  warnings,
  fieldTab,
  fieldLabels,
  serverErrors,
  errorMessages,
  savedMessage,
  save,
  onSaved,
}: UseTabbedFormOptions<TValues, TTab, TResult>) => {
  const [tab, setTab] = useState<TTab>(initialTab);
  const [saving, setSaving] = useState(false);
  // Одно уведомление об ошибке на форму: новая попытка заменяет прежнее, закрытая форма убирает его
  const toastId = `tabbed-form-${useId()}`;

  useEffect(() => () => toast.dismiss(toastId), [toastId]);

  const serverFields = Object.keys(fieldTab) as (keyof TValues & string)[];

  // Ошибка сервера живёт в errorMap.onServer поля, рядом с ошибками проверки формы
  const setServerErrors = (errors: FieldErrors<keyof TValues & string>) => {
    for (const field of serverFields) {
      form.setFieldMeta(field, (meta) => ({ ...meta, errorMap: { ...meta?.errorMap, onServer: errors[field] } }));
    }
  };

  // Ошибки проверки в порядке полей формы, с подписью поля
  const validationErrors = () => {
    const labels: Partial<Record<string, string>> = fieldLabels;
    const fields = new Set([...Object.keys(labels), ...Object.keys(form.state.fieldMeta)]);
    const lines: string[] = [];
    for (const field of fields) {
      const message = fieldError(form.getFieldMeta(field)?.errors ?? []);
      if (message) lines.push(labels[field] ? `${labels[field]}: ${message}` : message);
    }
    return lines;
  };

  const visibleTabs = tabs.map((item) => ({ ...item, warning: warnings[item.value] }));

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss(toastId);
    setServerErrors({});

    await form.handleSubmit();
    // Проверка не прошла: перечисляем поля и открываем вкладку, где что-то не так
    if (!form.state.isValid) {
      toast.error("проверьте поля", { id: toastId, ...toastBody(validationErrors()) });
      const withWarning = visibleTabs.find((item) => item.warning);
      if (withWarning) setTab(withWarning.value);
      return;
    }

    setSaving(true);
    try {
      const result = await save(form.state.values as TValues);
      toast.success(savedMessage);
      onSaved(result);
    } catch (caught) {
      // Текст — в уведомлении, отклонённые поля — красной рамкой, и открываем вкладку первого
      toast.error("не сохранено", { id: toastId, text: getApiErrorMessage(caught, errorMessages) });
      const fieldErrors = serverErrors(caught);
      setServerErrors(fieldErrors);
      const firstField = serverFields.find((field) => fieldErrors[field]);
      if (firstField) setTab(fieldTab[firstField] ?? initialTab);
    } finally {
      setSaving(false);
    }
  };

  return {
    tab,
    setTab,
    tabs: visibleTabs,
    submit,
    saving,
  };
};

export type TabbedFormController<TTab extends string> = ReturnType<typeof useTabbedForm<unknown, TTab, unknown>>;
