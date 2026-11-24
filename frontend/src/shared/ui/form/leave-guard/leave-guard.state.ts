// Общее для страницы с формой и слушателя «Назад» в корне приложения:
// confirm — спросить перед уходом (есть, пока на странице несохранённые изменения), leaving — выбрали «уйти»
export const leaveGuard: { confirm: ((leave: () => void) => void) | null; leaving: boolean } = {
  confirm: null,
  leaving: false,
};
