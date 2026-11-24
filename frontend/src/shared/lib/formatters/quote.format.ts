import { truncate } from "./text.format";

// Название внутри фразы: в кавычках и не длиннее строки уведомления.
// «Молочные продукты, сыры и кисломолочные изделия» → «Молочные продукты, сыры и кис…»
export const QUOTE_MAX_LENGTH = 30;

export const quote = (text: string, maxLength = QUOTE_MAX_LENGTH) => `«${truncate(text, maxLength)}»`;
