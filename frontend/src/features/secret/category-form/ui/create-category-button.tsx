"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICON_SIZE, ICON_STROKE } from "@/shared/config/icon";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/controls/button";

export const CreateCategoryButton = ({ label = "создать" }: { label?: string }) => {
  const router = useRouter();

  return (
    <Button variant="primary" onClick={() => router.push(ROUTES.secret.categoryNew())}>
      <Plus size={ICON_SIZE.medium} strokeWidth={ICON_STROKE.bold} />
      {label}
    </Button>
  );
};