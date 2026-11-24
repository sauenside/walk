import { randomUUID } from "node:crypto";
import { Injectable, Logger } from "@nestjs/common";
import { PictureStatus, type DbClient, type Picture } from "@/shared/database";
import { StorageService } from "@/shared/storage";
import type { CreatePictureDto } from "./dto/create-picture.dto";
import { PICTURE_EXTENSIONS, PICTURE_MAX_SIZE, PICTURE_VARIANTS } from "./picture.constants";
import { PictureError } from "./picture.errors";
import { PictureRepository } from "./picture.repository";

export type PictureRef = Pick<Picture, "id" | "key" | "width" | "height">;

export type PictureView = {
  id: string;
  urls: Record<keyof typeof PICTURE_VARIANTS, string>;
  width: number;
  height: number;
};

// Достаточно для ответа с картинкой; подключается в include других сущностей
export const PICTURE_REF = { select: { id: true, key: true, width: true, height: true } } as const;

@Injectable()
export class PictureService {
  private readonly logger = new Logger("Pictures");

  constructor(
    private readonly pictureRepository: PictureRepository,
    private readonly storage: StorageService,
  ) {}

  // Шаг 1: запись PENDING и подписанный URL, по которому клиент сам кладёт файл в R2
  async createUpload({ contentType, width, height }: CreatePictureDto) {
    const key = `pictures/${randomUUID()}.${PICTURE_EXTENSIONS[contentType]}`;
    const picture = await this.pictureRepository.create({ key, contentType, width, height });
    const upload = await this.storage.createUploadUrl(key, contentType);
    return { picture: this.toDetails(picture), upload };
  }

  // Шаг 2: после загрузки сверяем файл в R2 с заявленным и переводим в READY
  async confirm(id: string) {
    const picture = await this.getExisting(id);
    if (picture.status === PictureStatus.READY) return this.toDetails(picture);

    const object = await this.storage.head(picture.key);
    if (!object) throw PictureError.notUploaded();
    if (object.size > PICTURE_MAX_SIZE || object.contentType !== picture.contentType) {
      await this.storage.delete(picture.key);
      throw PictureError.invalidUpload();
    }

    return this.toDetails(await this.pictureRepository.markReady(id, object.size));
  }

  async getById(id: string) {
    return this.toDetails(await this.getExisting(id));
  }

  async remove(id: string) {
    const picture = await this.pictureRepository.transaction(async (client) => {
      const picture = await this.pictureRepository.findWithUsage(id, client);
      if (!picture) throw PictureError.notFound();
      if (picture._count.categories > 0) throw PictureError.inUse();
      await this.pictureRepository.delete(id, client);
      return picture;
    });

    // Файл удаляем после коммита: если R2 недоступен, останется лишний файл, а не битая ссылка
    await this.storage.delete(picture.key).catch((error: unknown) => {
      this.logger.error(`failed to delete file: ${picture.key}`, error instanceof Error ? error.stack : String(error));
    });
  }

  async assertReady(id: string, field: string, client?: DbClient) {
    const picture = await this.pictureRepository.findById(id, client);
    if (picture?.status !== PictureStatus.READY) throw PictureError.notReady(field);
  }

  toView = (picture: PictureRef | null): PictureView | null =>
    picture && { id: picture.id, urls: this.toUrls(picture.key), width: picture.width, height: picture.height };

  private toUrls(key: string): PictureView["urls"] {
    return {
      thumb: this.storage.toPublicUrl(key, { width: PICTURE_VARIANTS.thumb }),
      card: this.storage.toPublicUrl(key, { width: PICTURE_VARIANTS.card }),
      full: this.storage.toPublicUrl(key, { width: PICTURE_VARIANTS.full }),
    };
  }

  private toDetails(picture: Picture) {
    return {
      id: picture.id,
      status: picture.status,
      contentType: picture.contentType,
      size: picture.size,
      width: picture.width,
      height: picture.height,
      createdAt: picture.createdAt,
      urls: picture.status === PictureStatus.READY ? this.toUrls(picture.key) : null,
    };
  }

  private async getExisting(id: string) {
    const picture = await this.pictureRepository.findById(id);
    if (!picture) throw PictureError.notFound();
    return picture;
  }
}
