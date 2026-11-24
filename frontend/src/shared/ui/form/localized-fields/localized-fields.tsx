"use client";

import { useStore } from "@tanstack/react-form";
import { LANGS, LANG_LABEL, type Lang } from "@/shared/config/langs";
import type { AnyForm } from "@/shared/lib/form";
import { missingLangs } from "@/shared/lib/localized";
import { Input } from "../../controls/input";
import { Textarea } from "../../controls/textarea";
import { Dropdown, MenuItem } from "../../overlays/dropdown";
import { useChangeToast } from "../../overlays/toast";
import { Field } from "../field";
import "./localized-fields.css";

type LocalizedFieldsProps = {
  // Форма с полями nameRu/Kk/En и descriptionRu/Kk/En
  form: AnyForm;
  idPrefix: string;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  // Включённые на сайте языки: только на них название обязательно
  requiredLangs: readonly Lang[];
  namePlaceholders?: Partial<Record<Lang, string>>;
  descriptionPlaceholder?: string;
  // Например, собрать slug из русского названия
  onNameChange?: (lang: Lang, value: string) => void;
};

// Название и описание на трёх языках: язык выбирается в строке подписи «название», незаполненные
// помечены в списке языков и названы в уведомлении, когда их набор меняется
export const LocalizedFields = ({
  form,
  idPrefix,
  lang,
  onLangChange,
  requiredLangs,
  namePlaceholders = {},
  descriptionPlaceholder,
  onNameChange,
}: LocalizedFieldsProps) => {
  const values = useStore(form.store, (state) => state.values);
  const missing = missingLangs(values, "name", requiredLangs);

  useChangeToast(
    `${idPrefix}-missing-names`,
    missing.length > 0 ? `нет названия: ${missing.map((value) => LANG_LABEL[value]).join(", ")}` : undefined,
  );

  const languageSwitch = (
    <Dropdown label={LANG_LABEL[lang]} align="end" variant="compact">
      {(close) =>
        LANGS.map((value) => (
          <MenuItem
            key={value}
            checked={lang === value}
            hint={!requiredLangs.includes(value) ? "выключен на сайте" : missing.includes(value) ? "нет названия" : undefined}
            onClick={() => {
              onLangChange(value);
              close();
            }}
          >
            {LANG_LABEL[value]}
          </MenuItem>
        ))
      }
    </Dropdown>
  );

  // Поля всех языков смонтированы, виден выбранный: иначе ошибка поля другого языка терялась бы
  return LANGS.map((value) => (
    <div key={value} className="localized-fields-lang" hidden={value !== lang}>
      <form.Field name={`name${value}`}>
        {(field) => (
          <Field label="название" htmlFor={`${idPrefix}-name-${value}`} aside={languageSwitch}>
            <Input
              id={`${idPrefix}-name-${value}`}
              value={field.state.value}
              placeholder={namePlaceholders[value]}
              invalid={field.state.meta.errors.length > 0}
              onChange={(event) => {
                field.handleChange(event.target.value);
                onNameChange?.(value, event.target.value);
              }}
              onBlur={field.handleBlur}
            />
          </Field>
        )}
      </form.Field>
      <form.Field name={`description${value}`}>
        {(field) => (
          <Field label="описание" htmlFor={`${idPrefix}-description-${value}`}>
            <Textarea
              id={`${idPrefix}-description-${value}`}
              rows={3}
              value={field.state.value}
              placeholder={descriptionPlaceholder}
              invalid={field.state.meta.errors.length > 0}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </Field>
        )}
      </form.Field>
    </div>
  ));
};
