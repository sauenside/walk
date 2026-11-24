import { Injectable } from "@nestjs/common";
import { PictureStatus, PrismaService, type DbClient } from "@/shared/database";

@Injectable()
export class PictureRepository {
  constructor(private readonly prisma: PrismaService) {}

  transaction<T>(callback: (client: DbClient) => Promise<T>) {
    return this.prisma.$transaction(callback);
  }

  create(data: { key: string; contentType: string; width: number; height: number }) {
    return this.prisma.picture.create({ data });
  }

  findById(id: string, client: DbClient = this.prisma) {
    return client.picture.findUnique({ where: { id } });
  }

  findWithUsage(id: string, client: DbClient = this.prisma) {
    return client.picture.findUnique({ where: { id }, include: { _count: { select: { categories: true } } } });
  }

  markReady(id: string, size: number) {
    return this.prisma.picture.update({ where: { id }, data: { status: PictureStatus.READY, size } });
  }

  delete(id: string, client: DbClient = this.prisma) {
    return client.picture.delete({ where: { id } });
  }
}
