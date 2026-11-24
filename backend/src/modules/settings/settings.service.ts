import { Injectable } from "@nestjs/common";
import { LOCALES, type Locale } from "@/shared/i18n";
import type { UpdateSettingsDto } from "./dto/update-settings.dto";
import { SettingsError } from "./settings.errors";
import { toClientSettings, toSecretSettings } from "./settings.mapper";
import { SettingsRepository } from "./settings.repository";

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getSecret() {
    return toSecretSettings(await this.settingsRepository.get());
  }

  async getClient() {
    return toClientSettings(await this.settingsRepository.get());
  }

  async update(dto: UpdateSettingsDto) {
    const current = await this.settingsRepository.get();
    // Порядок языков всегда как в LOCALES, в каком бы порядке их ни прислали
    const enabledLocales = LOCALES.filter((locale) => (dto.enabledLocales ?? current.enabledLocales).includes(locale));
    const defaultLocale = dto.defaultLocale ?? current.defaultLocale;

    if (!enabledLocales.includes(defaultLocale)) throw SettingsError.defaultLocaleDisabled();

    return toSecretSettings(await this.settingsRepository.update({ enabledLocales, defaultLocale }));
  }

  // Язык ответа витрины: запрошенный, если он включён, иначе язык по умолчанию
  async resolveLocale(requested?: Locale) {
    const { enabledLocales, defaultLocale } = await this.settingsRepository.get();
    return requested && enabledLocales.includes(requested) ? requested : defaultLocale;
  }

  async getEnabledLocales() {
    return (await this.settingsRepository.get()).enabledLocales;
  }
}
