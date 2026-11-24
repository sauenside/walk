import { Controller, Get, Param, Query } from "@nestjs/common";
import { Public } from "@/shared/auth";
import { IdParamDto } from "@/shared/dto";
import { LocaleQueryDto } from "@/shared/i18n";
import { CategoryService } from "../category.service";

@Public()
@Controller("client/categories")
export class ClientCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  list(@Query() { locale }: LocaleQueryDto) {
    return this.categoryService.listVisible(locale);
  }

  @Get(":id")
  getById(@Param() { id }: IdParamDto, @Query() { locale }: LocaleQueryDto) {
    return this.categoryService.getVisibleById(id, locale);
  }
}
