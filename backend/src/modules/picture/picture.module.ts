import { Module } from "@nestjs/common";
import { SecretPictureController } from "./controllers/secret-picture.controller";
import { PictureRepository } from "./picture.repository";
import { PictureService } from "./picture.service";

@Module({
  controllers: [SecretPictureController],
  providers: [PictureService, PictureRepository],
  exports: [PictureService],
})
export class PictureModule {}
