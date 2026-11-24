import { Injectable } from "@nestjs/common";
import { PrismaService, type Prisma } from "@/shared/database";

// Строка настроек одна; её нет, пока настройки ни разу не читали — тогда создаётся со значениями по умолчанию
const SETTINGS_ID = 1;

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Обычно только чтение; запись — один раз, когда строки ещё нет
  async get() {
    const settings = await this.prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
    return settings ?? this.prisma.settings.upsert({ where: { id: SETTINGS_ID }, create: { id: SETTINGS_ID }, update: {} });
  }

  update(data: Prisma.SettingsUpdateInput) {
    return this.prisma.settings.upsert({
      where: { id: SETTINGS_ID },
      create: { ...(data as Prisma.SettingsCreateInput), id: SETTINGS_ID },
      update: data,
    });
  }
}
