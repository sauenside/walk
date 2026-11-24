import { Module } from "@nestjs/common";
import { PictureModule } from "@/modules/picture";
import { SettingsModule } from "@/modules/settings";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { ClientCategoryController } from "./controllers/client-category.controller";
import { SecretCategoryController } from "./controllers/secret-category.controller";

@Module({
  imports: [PictureModule, SettingsModule],
  controllers: [SecretCategoryController, ClientCategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
