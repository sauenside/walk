"use client";

import { FolderTree, GitBranch, Image as ImageIcon, Tags } from "lucide-react";
import {
  useSecretCategoryMetrics,
  type CategoryMetrics as Metrics,
} from "@/entities/category";
import { ICON_SIZE } from "@/shared/config/icon";
import { SlotGroup, SlotNumber } from "@/shared/ui/primitives/slot-number";
import {
  Metric,
  ResourcePageMetrics,
  VisibilityMetrics,
} from "@/shared/ui/templates/resource-page";

export const CategoryMetrics = () => {
  const query = useSecretCategoryMetrics();
  // Барабаны крутятся с момента отправки запроса, в том числе при повторной загрузке
  const loading = query.fetchStatus === "fetching";

  // null — запрос упал, в метрике остаётся прочерк
  const pick = (read: (metrics: Metrics) => number) =>
    query.isError ? null : query.data && read(query.data);

  const slot = (key: string, read: (metrics: Metrics) => number) => (
    <SlotNumber metricKey={key} value={pick(read)} />
  );

  return (
    <ResourcePageMetrics>
      <SlotGroup scope="secret.categories" loading={loading}>
        <Metric
          icon={<Tags size={ICON_SIZE.medium} />}
          label="категорий"
          value={slot("total", (metrics) => metrics.total)}
        />
        <Metric
          icon={<GitBranch size={ICON_SIZE.medium} />}
          label="корневых"
          value={slot("roots", (metrics) => metrics.roots)}
        />
        <VisibilityMetrics
          renderValue={(status) =>
            slot(`status.${status}`, (metrics) => metrics.status[status])
          }
        />
        <Metric
          icon="😀"
          label="эмодзи"
          value={slot("media.emoji", (metrics) => metrics.media.emoji)}
        />
        <Metric
          icon={<ImageIcon size={ICON_SIZE.medium} />}
          label="картинка"
          value={slot("media.picture", (metrics) => metrics.media.picture)}
        />
        <Metric
          icon={<FolderTree size={ICON_SIZE.medium} />}
          label="без оформления"
          value={slot("media.none", (metrics) => metrics.media.none)}
        />
      </SlotGroup>
    </ResourcePageMetrics>
  );
};
