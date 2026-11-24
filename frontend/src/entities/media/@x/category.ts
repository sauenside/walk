// Публичный вход только для сущности category.
// Так FSD разрешает сущностям ссылаться друг на друга, не нарушая изоляцию
export { mediaSchema, type Media } from "../model/schemas";
export { MediaThumb } from "../ui/media-thumb";
