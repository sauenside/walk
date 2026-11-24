import { Controller, Get } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { Public } from "../auth";
import { PrismaService } from "../database";
import { AppError } from "../errors";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  @SkipThrottle()
  async check() {
    try {
      await this.prisma.ping();
    } catch {
      throw AppError.serviceUnavailable("database unavailable");
    }

    return {
      status: "ok",
      database: "ok",
      uptimeSeconds: Math.round(process.uptime()),
    };
  }
}
