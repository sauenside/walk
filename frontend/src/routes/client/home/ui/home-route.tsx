import { getClientSettings } from "@/entities/settings";
import { LocaleSwitch } from "@/features/client/locale-switch";
import type { Locale } from "@/shared/config/langs";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { getLocale } from "@/shared/lib/locale/get-locale";
import { CategoryGrid } from "@/widgets/client/category-grid";
import "./home-route.css";

const TEXT: Record<Locale, { title: string; description: string }> = {
  ru: { title: "каталог", description: "выберите раздел, чтобы посмотреть товары" },
  kk: { title: "каталог", description: "тауарларды көру үшін бөлімді таңдаңыз" },
  en: { title: "catalog", description: "choose a section to see products" },
};

export const HomeRoute = async () => {
  const settings = await getClientSettings();
  const locale = await getLocale(settings);
  const text = TEXT[locale];

  return (
    <div className="home-route" lang={locale}>
      <div className="home-route-header">
        <div className="home-route-heading">
          <div className="home-route-title">
            {formatText(text.title, TEXT_CASE.title)}
          </div>
          <div className="home-route-description">{formatText(text.description, TEXT_CASE.hint)}</div>
        </div>
        {/* Один включённый язык — выбирать не из чего */}
        {settings.enabledLocales.length > 1 && <LocaleSwitch locale={locale} locales={settings.enabledLocales} />}
      </div>
      <CategoryGrid locale={locale} />
    </div>
  );
};
