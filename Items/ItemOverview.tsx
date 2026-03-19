import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Layout } from "Common/Layout"
import { Nullable } from "Common/MissingJavascriptFunctions"
import { MultiLineField } from "Common/TextField";
import { EditableItem } from "Items/EditableItem";

export const ItemOverview: React.FC<{ item: BaseItemDto; itemEditor?: EditableItem; isEditing: boolean; }> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.itemEditor)) {
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
