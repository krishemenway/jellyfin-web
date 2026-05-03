import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedText } from "Common/TranslatedText";
import { DateField } from "Common/TextField";
import { formatDate } from "node_modules/date-fns/format";

export const ItemPremiereDate: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	const premiereDate = React.useMemo(() => Nullable.HasValue(props.item.PremiereDate) ? formatDate(props.item.PremiereDate, "PPP") : undefined, [props.item.PremiereDate]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<Layout direction="row" gap=".5em" alignItems="center">
				<FieldLabel field={props.editableItem!.PremiereDate} />
				<DateField field={props.editableItem!.PremiereDate} px=".5em" py=".25em" />
			</Layout>
		);
	}

	if (Nullable.HasValue(premiereDate)) {
		return (
			<Layout direction="row" gap=".5em" alignItems="center">
				<Layout direction="row"><TranslatedText textKey="Premiere" /></Layout>
				<Layout direction="row">{premiereDate}</Layout>
			</Layout>
		);
	}

	return undefined;
};
