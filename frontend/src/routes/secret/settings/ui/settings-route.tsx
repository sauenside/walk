import { SettingsForm } from "@/features/secret/settings-form";
import { Page } from "@/shared/ui/templates/page";

// Страница настроек: разделы — вкладками, сохранение — кнопкой внизу
export const SettingsRoute = () => (
  <Page>
    <SettingsForm />
  </Page>
);
