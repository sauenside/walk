import { DeleteObjectCommand, HeadObjectCommand, NotFound, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../config";

export type ImageTransform = {
  width: number;
};

const UPLOAD_URL_TTL_SECONDS = 10 * 60;

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly imageTransforms: boolean;

  constructor(config: AppConfigService) {
    const r2 = config.r2;
    this.bucket = r2.bucket;
    this.publicUrl = r2.publicUrl;
    this.imageTransforms = r2.imageTransforms;
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
      // R2 не принимает checksum-заголовки, которые SDK по умолчанию добавляет в подписанные URL
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  async createUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
    // Content-Type входит в подпись: R2 отклонит загрузку с другим типом файла
    const url = await getSignedUrl(this.client, command, {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
      signableHeaders: new Set(["content-type"]),
    });
    return {
      url,
      method: "PUT" as const,
      headers: { "Content-Type": contentType },
      expiresAt: new Date(Date.now() + UPLOAD_URL_TTL_SECONDS * 1000).toISOString(),
    };
  }

  async head(key: string) {
    try {
      const object = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return { size: object.ContentLength ?? 0, contentType: object.ContentType ?? null };
    } catch (error) {
      if (error instanceof NotFound) return null;
      throw error;
    }
  }

  async delete(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  // Трансформации работают только на домене, подключённом к Cloudflare, на r2.dev их нет
  toPublicUrl(key: string, transform?: ImageTransform) {
    if (!transform || !this.imageTransforms) return `${this.publicUrl}/${key}`;
    return `${this.publicUrl}/cdn-cgi/image/width=${transform.width},fit=scale-down,format=auto/${key}`;
  }
}
