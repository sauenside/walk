"use client";

import { useState, type DragEvent } from "react";
import { Upload } from "lucide-react";
import {
  MEDIA_ACCEPT,
  MEDIA_ERROR_MESSAGES,
  MEDIA_FORMATS_TEXT,
  MEDIA_MAX_SIZE,
  MEDIA_MAX_SIZE_MB,
  MEDIA_REQUIREMENTS,
  type Media,
} from "@/entities/media";
import { getApiErrorMessage } from "@/shared/api/schemas";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import { toast } from "@/shared/ui/overlays/toast";
import { Spinner } from "@/shared/ui/primitives/spinner";
import { useMediaUpload } from "../model/use-media-upload";
import "./media-dropzone.css";

// Одно уведомление на загрузку: новая попытка заменяет прежнее
const TOAST_ID = "media-upload";

const failed = (text: string) => toast.error("картинка не загружена", { id: TOAST_ID, text });

type MediaDropzoneProps = {
  id: string;
  value: Media | null;
  onChange: (media: Media) => void;
  invalid?: boolean;
};

export const MediaDropzone = ({ id, value, onChange, invalid }: MediaDropzoneProps) => {
  const upload = useMediaUpload();
  const [dragging, setDragging] = useState(false);

  const send = (file: File | undefined) => {
    if (!file) return;
    toast.dismiss(TOAST_ID);
    if (!MEDIA_ACCEPT.includes(file.type)) return failed(`подходят только ${MEDIA_FORMATS_TEXT}`);
    if (file.size > MEDIA_MAX_SIZE) return failed(`файл больше ${MEDIA_MAX_SIZE_MB} МБ, уменьшите его и попробуйте снова`);
    // Через промис, а не колбэки mutate: ответ дойдёт, даже если вкладку формы успели сменить
    upload
      .mutateAsync(file)
      .then(onChange)
      .catch((error: unknown) => failed(getApiErrorMessage(error, MEDIA_ERROR_MESSAGES)));
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    send(event.dataTransfer.files[0]);
  };

  return (
    <label
      className={cx("media-dropzone", dragging && "is-dragging", invalid && "is-invalid")}
      htmlFor={id}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        id={id}
        className="media-dropzone-input"
        type="file"
        accept={MEDIA_ACCEPT.join(",")}
        onChange={(event) => {
          send(event.target.files?.[0]);
          // Сбрасываем, чтобы повторный выбор того же файла снова сработал
          event.target.value = "";
        }}
      />
      {upload.isPending ? (
        <div className="media-dropzone-preview">
          <Spinner size={ICON_SIZE.large} />
        </div>
      ) : value ? (
        <div className="media-dropzone-preview" style={{ backgroundImage: `url("${value.urls.card}")` }} />
      ) : (
        <div className="media-dropzone-preview">
          <Upload size={ICON_SIZE.large} />
        </div>
      )}
      <div className="media-dropzone-text">
        <div className="media-dropzone-title">
          {formatText(
            upload.isPending ? "загружаем…" : value ? `${value.width} × ${value.height} px` : "выберите или перетащите картинку",
            TEXT_CASE.label,
          )}
        </div>
        <div className="media-dropzone-hint">
          {formatText(
            value ? "нажмите или перетащите файл, чтобы заменить" : `${MEDIA_REQUIREMENTS}, квадрат от 512 px`,
            TEXT_CASE.hint,
          )}
        </div>
      </div>
    </label>
  );
};
