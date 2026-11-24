import { Module } from "@nestjs/common";
import { ClientSettingsController } from "./controllers/client-settings.controller";
import { SecretSettingsController } from "./controllers/secret-settings.controller";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";

@Module({
  controllers: [SecretSettingsController, ClientSettingsController],
  providers: [SettingsService, SettingsRepository],
  exports: [SettingsService],
})
export class SettingsModule {}
