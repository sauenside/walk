import { useForm } from "@tanstack/react-form";
import { settingsFormSchema, type SettingsFormValues } from "./settings-form.schema";

export const useSettingsForm = (defaultValues: SettingsFormValues) =>
  useForm({
    defaultValues,
    validators: { onSubmit: settingsFormSchema },
  });

export type SettingsForm = ReturnType<typeof useSettingsForm>;
