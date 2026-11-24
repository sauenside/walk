import type { ReactNode } from "react";
import { VISIBILITY_LABEL, VISIBILITY_STATUSES, type VisibilityStatus } from "@/shared/lib/visibility";
import { VisibilityDot } from "../../../primitives/visibility-status";
import { Metric } from "./resource-page-metrics";

type VisibilityMetricsProps = {
  // Число для статуса: просто цифра или, например, барабаны
  renderValue: (status: VisibilityStatus) => ReactNode;
};

// Три овала «● Доступна 41» «● Недоступна 3» «○ Скрыта 5» для любой сущности с видимостью
export const VisibilityMetrics = ({ renderValue }: VisibilityMetricsProps) => (
  <>
    {VISIBILITY_STATUSES.map((status) => (
      <Metric
        key={status}
        icon={<VisibilityDot status={status} />}
        value={renderValue(status)}
        label={VISIBILITY_LABEL[status]}
      />
    ))}
  </>
);
