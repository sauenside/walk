import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UpdateSettingsDto } from "../dto/update-settings.dto";
import { SettingsService } from "../settings.service";

@Controller("secret/settings")
export class SecretSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.getSecret();
  }

  @Patch()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}
