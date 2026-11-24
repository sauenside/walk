import { SUBCATEGORY_NOUNS, type CategoryRoot } from "@/entities/category";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText, plural } from "@/shared/lib/formatters";
import { displayName } from "@/shared/lib/localized";
import { Input } from "@/shared/ui/controls/input";
import { Field } from "@/shared/ui/form/field";
import { Dropdown, MenuItem, MenuScroll, MenuSeparator } from "@/shared/ui/overlays/dropdown";
import type { CategoryForm } from "../../model/use-category-form";

type PlacementTabProps = {
  form: CategoryForm;
  categoryId: string | undefined;
  childrenCount: number;
  roots: CategoryRoot[];
};

// Где категория в дереве: родитель и позиция среди соседей
export const PlacementTab = ({ form, categoryId, childrenCount, roots }: PlacementTabProps) => {
  // Себя в родители выбрать нельзя
  const parentOptions = roots.filter((root) => root.id !== categoryId);

  return (
    <>
      {childrenCount > 0 ? (
        <Field label="родитель">
          <div className="category-form-static">
            {formatText(
              `корневая, в ней ${childrenCount} ${plural(childrenCount, SUBCATEGORY_NOUNS)}, поэтому перенести её нельзя`,
              TEXT_CASE.hint,
            )}
          </div>
        </Field>
      ) : (
        <form.Field name="parentId">
          {(field) => {
            const parent = roots.find((root) => root.id === field.state.value);
            return (
              <Field label="родитель">
                <Dropdown
                  label={parent ? `${parent.emoji ?? ""} ${displayName(parent)}` : "нет, корневая"}
                  variant="block"
                >
                  {(close) => (
                    <>
                      <MenuItem
                        checked={field.state.value === null}
                        onClick={() => {
                          field.handleChange(null);
                          close();
                        }}
                      >
                        нет, корневая
                      </MenuItem>
                      <MenuSeparator />
                      <MenuScroll>
                        {parentOptions.map((root) => (
                          <MenuItem
                            key={root.id}
                            checked={field.state.value === root.id}
                            onClick={() => {
                              field.handleChange(root.id);
                              close();
                            }}
                          >
                            <div className="category-form-emoji">{root.emoji ?? "·"}</div>
                            {displayName(root)}
                          </MenuItem>
                        ))}
                      </MenuScroll>
                    </>
                  )}
                </Dropdown>
              </Field>
            );
          }}
        </form.Field>
      )}
      <form.Field name="position">
        {(field) => (
          <Field label="позиция" htmlFor="category-position" inline>
            <Input
              id="category-position"
              type="number"
              min={1}
              compact
              value={field.state.value}
              invalid={field.state.meta.errors.length > 0}
              onChange={(event) => field.handleChange(event.target.valueAsNumber)}
              onBlur={field.handleBlur}
            />
          </Field>
        )}
      </form.Field>
    </>
  );
};
