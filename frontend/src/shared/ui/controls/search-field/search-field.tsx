import { CircleX, Search } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import "./search-field.css";

type SearchFieldProps = {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export const SearchField = ({ id, value, placeholder, onChange }: SearchFieldProps) => (
  <label className="search-field" htmlFor={id}>
    <Search size={ICON_SIZE.medium} className="search-field-icon" />
    <input
      id={id}
      type="search"
      placeholder={formatText(placeholder, TEXT_CASE.hint)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        // Первый Esc очищает поиск, второй убирает курсор
        if (value) onChange("");
        else event.currentTarget.blur();
      }}
    />
    {value && (
      <button type="button" className="search-field-clear" onClick={() => onChange("")}>
        <CircleX size={ICON_SIZE.medium} />
      </button>
    )}
  </label>
);
