-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('kk', 'ru', 'en');

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "enabledLocales" "Locale"[] DEFAULT ARRAY['kk', 'ru', 'en']::"Locale"[],
    "defaultLocale" "Locale" NOT NULL DEFAULT 'ru',
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id"),
    -- Настройки существуют в одном экземпляре
    CONSTRAINT "Settings_single_row" CHECK ("id" = 1)
);
