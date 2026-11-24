import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { BulkFlagsDto, BulkIdsDto, IdParamDto } from "@/shared/dto";
import { CategoryService } from "../category.service";
import { CategoryListQueryDto } from "../dto/category-list-query.dto";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";

@Controller("secret/categories")
export class SecretCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  list(@Query() query: CategoryListQueryDto) {
    return this.categoryService.list(query);
  }

  @Get("metrics")
  getMetrics() {
    return this.categoryService.getMetrics();
  }

  @Get("roots")
  listRoots() {
    return this.categoryService.listRoots();
  }

  @Patch("bulk")
  bulkUpdate(@Body() dto: BulkFlagsDto) {
    return this.categoryService.bulkUpdate(dto);
  }

  @Delete("bulk")
  bulkDelete(@Body() dto: BulkIdsDto) {
    return this.categoryService.bulkDelete(dto);
  }

  @Get(":id")
  getById(@Param() { id }: IdParamDto) {
    return this.categoryService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(":id")
  update(@Param() { id }: IdParamDto, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: IdParamDto) {
    return this.categoryService.remove(id);
  }
}
