import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";

interface FieldLabelProps<T> {
	className?: string;
	field: EditableField<T>;
	textKey?: string;
}

export function FieldLabel<T>(props: FieldLabelProps<T>) {
	return (
		<label htmlFor={props.field.FieldId} className={props.className}>
			<TranslatedText textKey={props.textKey ?? props.field.FieldId} />
		</label>
	);
}
