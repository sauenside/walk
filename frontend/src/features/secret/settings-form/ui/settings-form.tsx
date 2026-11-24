"use client";

import { useMemo } from "react";
import { useStore } from "@tanstack/react-form";
import { SETTINGS_ERROR_MESSAGES, useSecretSettings, useUpdateSettings, type Settings } from "@/entities/settings";
import { ICON_SIZE } from "@/shared/config/icon";
import { useLeaveGuard } from "@/shared/ui/form/leave-guard";
import { TabbedForm, useTabbedForm } from "@/shared/ui/form/tabbed-form";
import { Spinner } from "@/shared/ui/primitives/spinner";
import { toServerFieldErrors } from "../lib/server-field-errors";
import { FIELD_LABEL, FIELD_TAB, SETTINGS_TABS } from "../model/form-tabs.config";
import { toFormValues, toSettingsInput, type SettingsFormValues } from "../model/settings-form.schema";
import { useSettingsForm } from "../model/use-settings-form";
import { LanguagesTab } from "./tabs/languages-tab";
import "./settings-form.css";

// Форма открывается с сохранёнными настройками; «Отмена» возвращает их, «Сохранить» отправляет
const SettingsFormContent = ({ settings }: { settings: Settings }) => {
  const updateSettings = useUpdateSettings();
  // После сохранения в кэше новые настройки — они и становятся «сохранёнными» для сравнения
  const savedValues = useMemo(() => toFormValues(settings), [settings]);
  const form = useSettingsForm(savedValues);
  const values = useStore(form.store, (state) => state.values);
  const changed = JSON.stringify(values) !== JSON.stringify(savedValues);
  const confirmLeave = useLeaveGuard(changed);

  const controller = useTabbedForm({
    form,
    tabs: SETTINGS_TABS,
    initialTab: "languages",
    warnings: {},
    fieldTab: FIELD_TAB,
    fieldLabels: FIELD_LABEL,
    serverErrors: toServerFieldErrors,
    errorMessages: SETTINGS_ERROR_MESSAGES,
    savedMessage: "настройки сохранены",
    save: (formValues: SettingsFormValues) => updateSettings.mutateAsync(toSettingsInput(formValues)),
    // Остаёмся на странице: сохранённое приходит в кэш, и форма сравнивает уже с ним
    onSaved: () => undefined,
  });

  return (
    <TabbedForm
      controller={controller}
      submitLabel="сохранить"
      onCancel={() => confirmLeave(() => form.reset(savedValues))}
      panels={{ languages: <LanguagesTab form={form} /> }}
    />
  );
};

// Настройки сайта: вкладки по разделам, внизу «Отмена» и «Сохранить»
export const SettingsForm = () => {
  const { data: settings } = useSecretSettings();

  if (!settings) {
    return (
      <div className="settings-form-pending">
        <Spinner size={ICON_SIZE.large} />
      </div>
    );
  }
  return <SettingsFormContent settings={settings} />;
};
