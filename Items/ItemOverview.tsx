import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Layout } from "Common/Layout"
import { Nullable } from "Common/MissingJavascriptFunctions"
import { useObservable } from "@residualeffect/rereactor";
import { ItemEditorService } from "Items/ItemEditorService";
import { MultiLineField } from "Common/TextField";
import { EditableItem } from "./EditableItem";

export const ItemOverview: React.FC<{ item: BaseItemDto; itemEditor?: EditableItem }> = (props) => {
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	if (isEditing && Nullable.HasValue(props.itemEditor)) {
		return (
			<MultiLineField field={props.itemEditor.Overview} px=".25em" py=".25em" />
		);
	}

	return Nullable.StringHasValue(props.item.Overview)
		? (
			<Layout direction="row" className={`${props.item.Type}-overview`}>
				{props.item.Overview}
			</Layout>
		) : <></>;
};
