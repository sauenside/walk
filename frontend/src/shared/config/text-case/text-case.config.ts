import type { TextCase } from "@/shared/lib/formatters";

// Регистр текста по ролям — одно место на весь проект. В коде тексты пишутся с маленькой буквы,
// заглавную на экране ставят компоненты: <Button>создать</Button> → «Создать».
// capitalize поднимает только первую букву: «slug», «WebP», «iPhone» внутри фразы не меняются
export const TEXT_CASE = {
  // Button, пункты меню, кнопка выпадающего списка, сегменты, кнопка в уведомлении
  button: "capitalize",
  // Заголовки страниц, окон, групп полей
  title: "capitalize",
  // Подписи полей и настроек, вкладки, метрики, плашки фильтров, разделы меню, шапка таблицы
  label: "capitalize",
  // Пояснения: описание страницы, подзаголовок окна, подсказки, плейсхолдеры
  hint: "capitalize",
  // Уведомления
  toast: "capitalize",
  // Названия записей из данных: «кофе» → «Кофе»
  name: "capitalize",
} as const satisfies Record<string, TextCase>;

export type TextRole = keyof typeof TEXT_CASE;
