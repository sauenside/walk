import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { IdParamDto } from "@/shared/dto";
import { CreatePictureDto } from "../dto/create-picture.dto";
import { PictureService } from "../picture.service";

@Controller("secret/pictures")
export class SecretPictureController {
  constructor(private readonly pictureService: PictureService) {}

  @Post()
  createUpload(@Body() dto: CreatePictureDto) {
    return this.pictureService.createUpload(dto);
  }

  @Post(":id/confirm")
  @HttpCode(HttpStatus.OK)
  confirm(@Param() { id }: IdParamDto) {
    return this.pictureService.confirm(id);
  }

  @Get(":id")
  getById(@Param() { id }: IdParamDto) {
    return this.pictureService.getById(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: IdParamDto) {
    return this.pictureService.remove(id);
  }
}
