import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { VISIBILITY_LABEL, type VisibilityStatus as Status } from "@/shared/lib/visibility";
import { Dot, type DotTone } from "../dot";
import "./visibility-status.css";

const TONE: Record<Status, DotTone> = {
  available: "success",
  unavailable: "warning",
  hidden: "muted",
};

export const VisibilityDot = ({ status }: { status: Status }) => <Dot tone={TONE[status]} />;

type VisibilityStatusProps = {
  status: Status;
  // Подпись под статусом, например «скрыта через родителя»
  note?: string;
};

export const VisibilityStatus = ({ status, note }: VisibilityStatusProps) => (
  <div className="visibility-status-cell">
    <div className={`visibility-status visibility-status-${status}`}>
      <VisibilityDot status={status} />
      {formatText(VISIBILITY_LABEL[status], TEXT_CASE.label)}
    </div>
    {note && <div className="visibility-status-note">{formatText(note, TEXT_CASE.hint)}</div>}
  </div>
);
