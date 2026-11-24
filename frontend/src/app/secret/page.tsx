import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/config/routes";

// Своей главной у панели нет: сразу открываются категории
export default function SecretPage() {
  redirect(ROUTES.secret.categories);
}
