import type { ReactNode } from "react";
import { X } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatChildren } from "@/shared/lib/formatters";
import "./chip.css";

type ChipProps = {
  children: ReactNode;
  onRemove: () => void;
};

// Плашка активного фильтра с крестиком
export const Chip = ({ children, onRemove }: ChipProps) => (
  <div className="chip">
    {formatChildren(children, TEXT_CASE.label)}
    <button type="button" onClick={onRemove}>
      <X size={ICON_SIZE.small} strokeWidth={ICON_STROKE.bold} />
    </button>
  </div>
);
