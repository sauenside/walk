import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { CategoryModule } from "@/modules/category/category.module";
import { PictureModule } from "@/modules/picture";
import { SettingsModule } from "@/modules/settings";
import { AppConfigModule, AppConfigService } from "@/shared/config";
import { PrismaModule } from "@/shared/database";
import { HealthModule } from "@/shared/health";
import { StorageModule } from "@/shared/storage";
import { APP_PROVIDERS } from "./app.providers";

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    StorageModule,
    HealthModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        throttlers: [{ name: "default", ttl: config.throttle.ttlMs, limit: config.throttle.limit }],
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwt.accessSecret,
        signOptions: { expiresIn: config.jwt.accessExpiresIn as JwtSignOptions["expiresIn"] },
      }),
    }),
    SettingsModule,
    PictureModule,
    CategoryModule,
  ],
  providers: APP_PROVIDERS,
})
export class AppModule {}
