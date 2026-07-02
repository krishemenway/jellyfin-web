import * as React from "react";
import { ArrowSelectIcon } from "CommonIcons/ArrowSelectIcon";
import { ItemListService } from "ItemList/ItemListService";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { SelectAllIcon } from "CommonIcons/SelectAllIcon";
import { DeselectIcon } from "CommonIcons/DeselectIcon";

export function useSelectModeActions(enabled: boolean, itemList: ItemListService): ItemMenuAction[] {
	const ToggleAction: ItemMenuAction = {
		icon: (p) => <ArrowSelectIcon {...p} />,
		textKey: "ButtonSelectView",
		action: () => itemList.ToggleSelectMode(),
	};

	const SelectAllAction: ItemMenuAction = {
		icon: (p) => <SelectAllIcon {...p} />,
		textKey: "SelectAll",
		action: (_1, _2, _3, items) => itemList.SelectedItems.push(...items),
		visible: () => enabled,
	};

	const ClearSelectionAction: ItemMenuAction = {
		icon: (p) => <DeselectIcon {...p} />,
		textKey: "ClearSelection",
		action: () => itemList.SelectedItems.clear(),
		visible: () => enabled,
	};

	return [
		ToggleAction,
		SelectAllAction,
		ClearSelectionAction,
	];
}
