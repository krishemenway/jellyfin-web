import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedText } from "Common/TranslatedText";
import { DateField } from "Common/TextField";
import { formatDate } from "date-fns";

export const ItemPremiereDate: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	const premiereDate = React.useMemo(() => Nullable.StringValue(props.item.PremiereDate, "", (date) => formatDate(DateTime.ParseWithoutZone(date), "PPP")), [props.item.PremiereDate]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<Layout direction="row" gap=".5em" alignItems="center">
				<FieldLabel field={props.editableItem!.PremiereDate} />
				<DateField field={props.editableItem!.PremiereDate} px=".5em" py=".25em" />
			</Layout>
		);
	}

	return Nullable.StringValue(premiereDate, <></>, (premiereDate) => (
		<Layout direction="row" gap=".5em" alignItems="center">
			<TranslatedText textKey="Premiere" elementType="div" />
			<Layout direction="row">{premiereDate}</Layout>
		</Layout>
	));
};
