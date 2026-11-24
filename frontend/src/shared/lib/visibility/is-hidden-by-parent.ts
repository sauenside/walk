// Запись показывается, но родитель (категория) скрыт — покупатели её всё равно не увидят
export const isHiddenByParent = (item: { isEnabled: boolean }, parent: { isEnabled: boolean } | null | undefined) =>
  !!parent && !parent.isEnabled && item.isEnabled;
