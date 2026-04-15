import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Layout } from "Common/Layout"
import { Nullable } from "Common/MissingJavascriptFunctions"
import { MultiLineField } from "Common/TextField";
import { EditableItemProps } from "Items/EditableItemProps";

export const ItemOverview: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<MultiLineField field={props.editableItem.Overview} px=".25em" py=".25em" />
		);
	}

	return Nullable.StringHasValue(props.item.Overview)
		? (
			<Layout direction="row" className={`${props.item.Type}-overview`}>
				{props.item.Overview}
			</Layout>
		) : <></>;
};
