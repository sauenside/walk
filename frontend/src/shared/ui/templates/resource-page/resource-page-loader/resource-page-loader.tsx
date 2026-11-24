"use client";

import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { useInfiniteScroll } from "@/shared/lib/hooks";
import { Spinner } from "../../../primitives/spinner";
import "./resource-page-loader.css";

type ResourcePageLoaderProps = {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
};

// Маркер внизу таблицы: когда он виден, загружается следующая порция
export const ResourcePageLoader = ({ hasMore, loading, onLoadMore }: ResourcePageLoaderProps) => {
  const ref = useInfiniteScroll<HTMLDivElement>({ enabled: hasMore && !loading, onLoadMore });

  if (!hasMore) return null;

  return (
    <div ref={ref} className="resource-page-loader">
      <Spinner />
      {formatText("загружаем ещё…", TEXT_CASE.hint)}
    </div>
  );
};
