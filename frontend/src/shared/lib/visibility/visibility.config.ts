export const VISIBILITY_STATUSES = ["available", "unavailable", "hidden"] as const;

// available — открывается; unavailable — видна серой «Скоро»; hidden — покупатели не видят
export type VisibilityStatus = (typeof VISIBILITY_STATUSES)[number];

export const VISIBILITY_LABEL: Record<VisibilityStatus, string> = {
  available: "доступна",
  unavailable: "недоступна",
  hidden: "скрыта",
};
