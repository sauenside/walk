import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppConfigService } from "../config";
import { PrismaClient } from "./generated/client";
import { PRISMA_GLOBAL_OMIT } from "./prisma-omit";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("Database");

  constructor(config: AppConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.databaseUrl,
        max: config.databasePoolMax,
        connectionTimeoutMillis: 5_000,
        idleTimeoutMillis: 30_000,
        statement_timeout: config.requestTimeoutMs,
      }),
      omit: PRISMA_GLOBAL_OMIT,
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ping();
    this.logger.log("database connected");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async ping() {
    await this.$queryRaw`SELECT 1`;
  }
}
