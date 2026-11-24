import type { ReactFormExtendedApi } from "@tanstack/react-form";

type FullForm = ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;

// Форма TanStack любой сущности: общим компонентам не нужны её точные типы.
// Только то, чем они пользуются: иначе форма с полем-массивом не подходит по методам массивов
export type AnyForm = Pick<FullForm, "store" | "state" | "Field" | "setFieldMeta" | "getFieldMeta" | "handleSubmit">;
