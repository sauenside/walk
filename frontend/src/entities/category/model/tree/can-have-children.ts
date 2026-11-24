// Два уровня: подкатегории бывают только у корневых категорий
export const canHaveChildren = (category: { parentId: string | null }) => category.parentId === null;
