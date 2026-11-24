"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock, LockOpen, Pencil, Trash, X } from "lucide-react";
import { getApiErrorMessage, type ApiErrorMessages } from "@/shared/api/schemas";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText, plural, quote } from "@/shared/lib/formatters";
import type { SelectionStore } from "@/shared/lib/store-factories";
import type { Visibility } from "@/shared/lib/visibility";
import { Button } from "../controls/button";
import { Dropdown, MenuItem, MenuSection, MenuSeparator } from "../overlays/dropdown";
import { toast } from "../overlays/toast";
import "./resource-kit.css";

type Forms = [one: string, few: string, many: string];

// Достаточно того, что есть у мутаций React Query. Промис, а не колбэки mutate:
// уведомление о результате придёт, даже если меню успели закрыть
type MutationLike<TVariables> = {
  mutateAsync: (variables: TVariables) => Promise<unknown>;
  isPending: boolean;
};

type ActionsContext<T> = {
  items: T[];
  single: T | undefined;
  close: () => void;
};

type ResourceActionsMenuConfig<T extends { id: string }, P> = {
  useSelection: SelectionStore<T>;
  useBulkUpdate: () => MutationLike<{ ids: string[] } & Partial<Visibility>>;
  useBulkDelete: () => MutationLike<string[]>;
  isDeletable: (item: T) => boolean;
  // Название строки, чтобы перечислить, какие записи мешают удалению
  getLabel: (item: T) => string;
  // «категория / категории / категорий» и «категорию / категории / категорий»
  nouns: { nominative: Forms; accusative: Forms };
  // Правило удаления, например «Удалить можно только категории без подкатегорий.»
  deleteRule: string;
  // Тексты ошибок ресурса по коду ответа API
  errorMessages?: ApiErrorMessages;
  // Свои пункты ресурса после «Редактировать», например «Добавить подкатегорию»
  renderExtraItems?: (context: ActionsContext<T>, props: P) => ReactNode;
};

const MAX_LISTED = 3;

// Одно уведомление на меню: новое действие заменяет прежнее
const TOAST_ID = "resource-actions";

const listLabels = (labels: string[]) => {
  const listed = labels.slice(0, MAX_LISTED).map((label) => quote(label));
  const rest = labels.length - listed.length;
  return rest > 0 ? `${listed.join(", ")} и ещё ${rest}` : listed.join(", ");
};

// Итог массового изменения для уведомления
const updatedLabel = (patch: Partial<Visibility>) => {
  if (patch.isEnabled !== undefined) return patch.isEnabled ? "показано в каталоге" : "скрыто из каталога";
  return patch.isActive ? "доступ открыт" : "доступ закрыт";
};

export const createResourceActionsMenu = <T extends { id: string }, P extends object = object>({
  useSelection,
  useBulkUpdate,
  useBulkDelete,
  isDeletable,
  getLabel,
  nouns,
  deleteRule,
  errorMessages,
  renderExtraItems,
}: ResourceActionsMenuConfig<T, P>) => {
  type MenuProps = { onEdit: (id: string) => void } & P;

  const counted = (count: number) => `${count} ${plural(count, nouns.nominative)}`;

  const Content = ({ props, close }: { props: MenuProps; close: () => void }) => {
    const { selected, clear, deselect } = useSelection();
    const bulkUpdate = useBulkUpdate();
    const bulkDelete = useBulkDelete();
    const [confirming, setConfirming] = useState(false);

    const items = [...selected.values()];
    const ids = items.map((item) => item.id);
    const single = items.length === 1 ? items[0] : undefined;

    const finish = () => {
      clear();
      close();
    };

    // Успех — уведомление и сброс выделения, ошибка — уведомление, выделение остаётся для повтора
    const run = (action: Promise<unknown>, doneLabel: string) => {
      toast.dismiss(TOAST_ID);
      action
        .then(() => {
          toast.success(`${doneLabel}: ${counted(items.length)}`, { id: TOAST_ID });
          finish();
        })
        .catch((error: unknown) =>
          toast.error("не выполнено", { id: TOAST_ID, text: getApiErrorMessage(error, errorMessages) }),
        );
    };

    const update = (patch: Partial<Visibility>) => run(bulkUpdate.mutateAsync({ ids, ...patch }), updatedLabel(patch));

    // Удаление атомарное: пока среди выбранных есть неудаляемые, не удаляется ничего — предупреждаем сразу
    const startDelete = () => {
      const blocked = items.filter((item) => !isDeletable(item));
      if (blocked.length === 0) return setConfirming(true);

      toast.warning(items.length === 1 ? "нельзя удалить" : `нельзя удалить ${blocked.length} из ${items.length}`, {
        id: TOAST_ID,
        text: `${deleteRule}: ${listLabels(blocked.map(getLabel))}`,
        actions:
          blocked.length < items.length
            ? [{ label: "снять с них выделение", onClick: () => deselect(blocked.map((item) => item.id)) }]
            : undefined,
      });
      close();
    };

    if (confirming) {
      return (
        <div className="resource-delete-confirm">
          <div>{formatText(`удалить ${items.length} ${plural(items.length, nouns.accusative)}?`, TEXT_CASE.label)}</div>
          <div className="resource-delete-confirm-actions">
            <Button size="sm" onClick={close}>
              отмена
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={bulkDelete.isPending}
              onClick={() => run(bulkDelete.mutateAsync(ids), "удалено")}
            >
              удалить {items.length}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <MenuSection>
          выбрано: {counted(items.length)}
        </MenuSection>
        <MenuItem
          icon={<Pencil size={ICON_SIZE.small} />}
          disabled={!single}
          hint={single ? undefined : "одну"}
          onClick={() => {
            if (single) props.onEdit(single.id);
            close();
          }}
        >
          редактировать
        </MenuItem>
        {renderExtraItems?.({ items, single, close }, props)}
        <MenuSeparator />
        <MenuItem icon={<Eye size={ICON_SIZE.small} />} disabled={bulkUpdate.isPending} onClick={() => update({ isEnabled: true })}>
          показать в каталоге
        </MenuItem>
        <MenuItem
          icon={<EyeOff size={ICON_SIZE.small} />}
          disabled={bulkUpdate.isPending}
          onClick={() => update({ isEnabled: false })}
        >
          скрыть из каталога
        </MenuItem>
        <MenuItem
          icon={<LockOpen size={ICON_SIZE.small} />}
          disabled={bulkUpdate.isPending}
          onClick={() => update({ isActive: true })}
        >
          открыть доступ
        </MenuItem>
        <MenuItem icon={<Lock size={ICON_SIZE.small} />} disabled={bulkUpdate.isPending} onClick={() => update({ isActive: false })}>
          закрыть доступ
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<X size={ICON_SIZE.small} />} hint="Esc" onClick={finish}>
          снять выделение
        </MenuItem>
        <MenuItem icon={<Trash size={ICON_SIZE.small} />} danger onClick={startDelete}>
          удалить…
        </MenuItem>
      </>
    );
  };

  const ResourceActionsMenu = (props: MenuProps) => {
    const count = useSelection((state) => state.selected.size);

    return (
      <Dropdown label={count ? `действия: ${count}` : "действия"} disabled={count === 0} active={count > 0}>
        {(close) => <Content props={props} close={close} />}
      </Dropdown>
    );
  };

  return ResourceActionsMenu;
};
