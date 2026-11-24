const dateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso)).replace(" г.", "");
