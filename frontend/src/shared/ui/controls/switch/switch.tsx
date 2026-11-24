import { cx } from "@/shared/lib/dom";
import "./switch.css";

type SwitchProps = {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export const Switch = ({ id, checked, disabled, onChange }: SwitchProps) => (
  <button
    id={id}
    type="button"
    disabled={disabled}
    className={cx("switch", checked && "is-on")}
    onClick={() => onChange(!checked)}
  >
    <div className="switch-knob" />
  </button>
);
