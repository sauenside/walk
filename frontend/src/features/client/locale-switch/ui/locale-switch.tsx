"use client";

import { Languages } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { LANG_LABEL, LOCALES, toLang, type Locale } from "@/shared/config/langs";
import { setLocale } from "@/shared/lib/locale/set-locale";
import { Dropdown, MenuItem } from "@/shared/ui/overlays/dropdown";

type LocaleSwitchProps = {
  locale: Locale;
  // Включённые в настройках языки; порядок всегда как в LOCALES
  locales: readonly Locale[];
};

export const LocaleSwitch = ({ locale, locales }: LocaleSwitchProps) => (
  <Dropdown label={LANG_LABEL[toLang(locale)]} icon={<Languages size={ICON_SIZE.medium} />} align="end">
    {(close) =>
      LOCALES.filter((value) => locales.includes(value)).map((value) => (
        <MenuItem
          key={value}
          checked={value === locale}
          onClick={() => {
            close();
            if (value !== locale) setLocale(value);
          }}
        >
          {LANG_LABEL[toLang(value)]}
        </MenuItem>
      ))
    }
  </Dropdown>
);
