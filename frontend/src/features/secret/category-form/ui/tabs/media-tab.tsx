import type { ReactNode } from "react";
import type { MediaType } from "@/entities/category";
import type { Media } from "@/entities/media";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import { Input } from "@/shared/ui/controls/input";
import { Segmented } from "@/shared/ui/controls/segmented";
import { Field } from "@/shared/ui/form/field";
import type { CategoryForm } from "../../model/use-category-form";

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: "NONE", label: "нет" },
  { value: "EMOJI", label: "эмодзи" },
  { value: "PICTURE", label: "картинка" },
];

const EMOJI_PRESETS = ["🥛", "🧀", "🥩", "🍞", "🍎", "🥕", "🌾", "🧃", "☕", "🧊", "🧴", "🧸", "🔌", "🐾", "🎁", "🏷️"];

export type MediaPickerProps = {
  id: string;
  value: Media | null;
  onChange: (media: Media) => void;
  invalid: boolean;
};

// Выбор картинки — отдельная фича; страница подставляет её сюда
export type MediaPickerRender = (props: MediaPickerProps) => ReactNode;

type MediaTabProps = {
  form: CategoryForm;
  renderMediaPicker: MediaPickerRender;
};

export const MediaTab = ({ form, renderMediaPicker }: MediaTabProps) => (
  <>
    <form.Field name="mediaType">
      {(field) => (
        <Segmented options={MEDIA_TYPES} value={field.state.value} onChange={(value) => field.handleChange(value)} />
      )}
    </form.Field>

    <form.Subscribe selector={(state) => state.values.mediaType}>
      {(mediaType) => {
        if (mediaType === "NONE") {
          return <div className="category-form-hint">{formatText("покупатели увидят только название, без значка", TEXT_CASE.hint)}</div>;
        }

        if (mediaType === "EMOJI") {
          return (
            <form.Field name="emoji">
              {(field) => (
                <div className="emoji-picker">
                    <div className="emoji-grid">
                      {EMOJI_PRESETS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className={cx("emoji-option", field.state.value === emoji && "is-active")}
                          onClick={() => field.handleChange(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <Field label="свой эмодзи" htmlFor="category-emoji" inline>
                      <Input
                        id="category-emoji"
                        className="emoji-input"
                        value={field.state.value}
                        maxLength={4}
                        invalid={field.state.meta.errors.length > 0}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </Field>
                </div>
              )}
            </form.Field>
          );
        }

        return (
          <form.Field name="picture">
            {(field) =>
              renderMediaPicker({
                id: "category-picture",
                value: field.state.value,
                onChange: (media) => field.handleChange(media),
                invalid: field.state.meta.errors.length > 0,
              })
            }
          </form.Field>
        );
      }}
    </form.Subscribe>
  </>
);
