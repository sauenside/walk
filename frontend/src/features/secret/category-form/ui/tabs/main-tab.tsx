import type { Lang } from "@/shared/config/langs";
import { SLUG_LABEL, slugify } from "@/shared/lib/slug";
import { Input } from "@/shared/ui/controls/input";
import { Field } from "@/shared/ui/form/field";
import { LocalizedFields } from "@/shared/ui/form/localized-fields";
import type { CategoryForm } from "../../model/use-category-form";

const NAME_PLACEHOLDERS: Record<Lang, string> = {
  Ru: "например, молочные продукты",
  Kk: "мысалы, сүт өнімдері",
  En: "for example, dairy",
};

type MainTabProps = {
  form: CategoryForm;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  requiredLangs: readonly Lang[];
};

// Название и описание на трёх языках, адрес на сайте
export const MainTab = ({ form, lang, onLangChange, requiredLangs }: MainTabProps) => (
  <>
    <LocalizedFields
      form={form}
      idPrefix="category"
      lang={lang}
      onLangChange={onLangChange}
      requiredLangs={requiredLangs}
      namePlaceholders={NAME_PLACEHOLDERS}
      descriptionPlaceholder="коротко о том, что лежит в категории"
      onNameChange={(changedLang, value) => {
        // Адрес следует за русским названием, пока его не поменяли вручную
        if (changedLang === "Ru" && form.getFieldValue("slugAuto")) form.setFieldValue("slug", slugify(value));
      }}
    />

    <form.Field name="slug">
      {(field) => (
        <Field
          label={SLUG_LABEL}
          htmlFor="category-slug"
          hint="часть ссылки на категорию, собирается из русского названия, можно изменить"
        >
          <Input
            id="category-slug"
            value={field.state.value}
            placeholder="molochnye-produkty"
            textCase="none"
            spellCheck={false}
            autoComplete="off"
            invalid={field.state.meta.errors.length > 0}
            onChange={(event) => {
              field.handleChange(event.target.value.toLowerCase());
              // Очистил поле — адрес снова собирается из названия
              form.setFieldValue("slugAuto", event.target.value.trim() === "");
            }}
            onBlur={field.handleBlur}
          />
        </Field>
      )}
    </form.Field>
  </>
);
