import { AppError } from "@/shared/errors";
import { PICTURE_MAX_SIZE } from "./picture.constants";

export const PictureError = {
  notFound: () => AppError.notFound("picture not found", "PICTURE_NOT_FOUND"),

  notUploaded: () => AppError.conflict("file is not uploaded yet", "PICTURE_NOT_UPLOADED"),

  invalidUpload: () =>
    AppError.conflict("uploaded file does not match the request", "PICTURE_INVALID_UPLOAD", {
      file: `expected declared content type and at most: ${PICTURE_MAX_SIZE} bytes`,
    }),

  inUse: () => AppError.conflict("picture is in use", "PICTURE_IN_USE"),

  notReady: (field: string) => AppError.validation({ [field]: "picture not found or not uploaded" }),
};
