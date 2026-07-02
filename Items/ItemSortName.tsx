import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EditableItemProps } from "Items/EditableItemProps";
import { TextField } from "Common/TextField";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";

export const ItemSortName: React.FC<EditableItemProps> = ({ editableItem, isEditing }) => {
	if (!isEditing || !Nullable.HasValue(editableItem)) {
		return <></>;
	}

	return (
		<Layout direction="row" gap="1rem" alignItems="center">
			<FieldLabel field={editableItem.ForcedSortName} />
			<TextField field={editableItem.ForcedSortName} grow px=".25em" py=".25em" />
		</Layout>
	);
};
