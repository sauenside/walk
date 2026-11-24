import { createQueryKeys } from "@/shared/api/factories";
import type { Locale } from "@/shared/config/langs";

export const clientCategoryKeys = createQueryKeys<Locale>("client", "categories");
