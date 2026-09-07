import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedDate, TranslatedText } from "Common/TranslatedText";
import { DateField } from "Common/DateField";

export const ItemPremiereDate: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	const premiereDate = React.useMemo(() => Nullable.StringValue(props.item.PremiereDate, null, (date) => DateTime.ParseWithoutZone(date)), [props.item.PremiereDate]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<Layout direction="row" gap=".5em" alignItems="center">
				<FieldLabel field={props.editableItem.PremiereDate} />
				<DateField field={props.editableItem.PremiereDate} px=".5em" py=".25em" bt br bb bl />
			</Layout>
		);
	}

	return Nullable.Value(premiereDate, <></>, (premiereDate) => (
		<Layout direction="row" gap=".5em" alignItems="center">
			<TranslatedText textKey="Premiere" elementType="div" />
			<TranslatedDate elementType="div" date={premiereDate} year="numeric" month="long" day="numeric" />
		</Layout>
	));
};
