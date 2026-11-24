import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { getVisibility, type Visibility } from "@/shared/lib/visibility";
import { Switch } from "../../controls/switch";
import { VisibilityStatus } from "../../primitives/visibility-status";
import { SettingList, SettingRow } from "../setting-row";
import "./visibility-settings.css";

type VisibilitySettingsProps = {
  idPrefix: string;
  value: Visibility;
  onChange: (patch: Partial<Visibility>) => void;
};

// Два переключателя видимости и итог «Сейчас для покупателей» — одинаково для любых записей
export const VisibilitySettings = ({ idPrefix, value, onChange }: VisibilitySettingsProps) => (
  <div className="visibility-settings">
    <SettingList>
      <SettingRow
        controlId={`${idPrefix}-enabled`}
        label="показывать в каталоге"
        hint="если выключить, запись полностью исчезнет для покупателей"
        control={
          <Switch
            id={`${idPrefix}-enabled`}
            checked={value.isEnabled}
            onChange={(isEnabled) => onChange({ isEnabled })}
          />
        }
      />
      <SettingRow
        controlId={`${idPrefix}-active`}
        label="доступна для перехода"
        hint="если выключить, покупатели увидят запись серой с пометкой «Скоро», но не смогут её открыть"
        disabled={!value.isEnabled}
        control={
          <Switch
            id={`${idPrefix}-active`}
            checked={value.isActive}
            disabled={!value.isEnabled}
            onChange={(isActive) => onChange({ isActive })}
          />
        }
      />
    </SettingList>
    <div className="visibility-settings-summary">
      {formatText("сейчас для покупателей:", TEXT_CASE.hint)}
      <VisibilityStatus status={getVisibility(value)} />
    </div>
  </div>
);
