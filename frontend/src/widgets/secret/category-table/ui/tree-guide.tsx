import { cx } from "@/shared/lib/dom";

// Линия дерева в потоке сетки: верхняя половина рисует ├ или └, нижняя ведёт к следующей подкатегории
export const TreeGuide = ({ isLast }: { isLast: boolean }) => (
  <div className={cx("tree-guide", isLast && "is-last")}>
    <div className="tree-guide-top" />
    <div className="tree-guide-bottom" />
  </div>
);
