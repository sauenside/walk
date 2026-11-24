import { LANG_LABEL, LOCALES, toLang, type Locale } from "@/shared/config/langs";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { Checkbox } from "@/shared/ui/controls/checkbox";
import { Segmented } from "@/shared/ui/controls/segmented";
import { SettingList, SettingRow } from "@/shared/ui/form/setting-row";
import type { SettingsForm } from "../../model/use-settings-form";

const languageName = (locale: Locale) => LANG_LABEL[toLang(locale)];

// Языки сайта: галочки включают язык на витрине, сегменты выбирают язык по умолчанию
export const LanguagesTab = ({ form }: { form: SettingsForm }) => (
  <>
    <div className="settings-form-hint">
      {formatText(
        "покупатели видят только включённые языки, переключатель языка появляется, когда их больше одного",
        TEXT_CASE.hint,
      )}
    </div>
    <form.Subscribe selector={(state) => state.values}>
      {({ enabledLocales, defaultLocale }) => (
        <SettingList>
          {LOCALES.map((locale) => {
            const enabled = enabledLocales.includes(locale);
            const isDefault = locale === defaultLocale;
            return (
              <SettingRow
                key={locale}
                controlId={`settings-locale-${locale}`}
                label={languageName(locale)}
                hint={isDefault ? "язык по умолчанию, его нельзя выключить" : undefined}
                control={
                  <Checkbox
                    id={`settings-locale-${locale}`}
                    checked={enabled}
                    disabled={isDefault}
                    onChange={() =>
                      form.setFieldValue(
                        "enabledLocales",
                        LOCALES.filter((value) => (value === locale ? !enabled : enabledLocales.includes(value))),
                      )
                    }
                  />
                }
              />
            );
          })}
          <SettingRow
            controlId="settings-default-locale"
            label="язык по умолчанию"
            hint="на нём сайт открывается, пока покупатель не выбрал другой"
            control={
              <Segmented
                options={enabledLocales.map((locale) => ({ value: locale, label: languageName(locale) }))}
                value={defaultLocale}
                onChange={(value) => form.setFieldValue("defaultLocale", value)}
              />
            }
          />
        </SettingList>
      )}
    </form.Subscribe>
  </>
);
