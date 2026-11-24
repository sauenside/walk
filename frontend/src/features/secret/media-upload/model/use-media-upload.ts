import { useMutation } from "@tanstack/react-query";
import { secretMediaApi } from "@/entities/media";

export const useMediaUpload = () =>
  useMutation({
    mutationFn: (file: File) => secretMediaApi.upload(file),
  });
