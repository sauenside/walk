import { useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  enabled: boolean;
  onLoadMore: () => void;
};

// Возвращает ref для маркера: когда маркер подходит к экрану, вызывается onLoadMore.
// После каждой порции наблюдение перезапускается, поэтому экран дозаполняется сам
export const useInfiniteScroll = <T extends HTMLElement>({ enabled, onLoadMore }: UseInfiniteScrollOptions) => {
  const ref = useRef<T>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMoreRef.current();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
};
