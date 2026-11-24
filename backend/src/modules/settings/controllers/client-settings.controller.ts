import { Controller, Get } from "@nestjs/common";
import { Public } from "@/shared/auth";
import { SettingsService } from "../settings.service";

@Public()
@Controller("client/settings")
export class ClientSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.getClient();
  }
}
