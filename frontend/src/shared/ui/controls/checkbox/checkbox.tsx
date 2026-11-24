import "./checkbox.css";

type CheckboxProps = {
  // Нужен, когда клик по подписи должен переключать галочку
  id?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

export const Checkbox = ({ id, checked, disabled, onChange }: CheckboxProps) => (
  <input id={id} type="checkbox" className="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
);
