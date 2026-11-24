// Склеивает классы, пропуская пустые значения: cx("row", isOpen && "is-open")
export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
