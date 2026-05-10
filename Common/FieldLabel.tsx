import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";

interface FieldLabelProps<T> extends StyleLayoutProps {
	className?: string;
	field: EditableField<T>;
	textKey?: string;
}

export function FieldLabel<T>(props: FieldLabelProps<T>) {
	return (
		<label htmlFor={props.field.FieldId} className={props.className} style={ApplyLayoutStyleProps(props)}>
			<TranslatedText textKey={props.textKey ?? props.field.FieldId} />
		</label>
	);
}
