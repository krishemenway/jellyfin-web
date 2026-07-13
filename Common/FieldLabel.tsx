import * as React from "react";
import { IEditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface FieldLabelProps {
	classes?: string[];
	field: IEditableField;
	id?: string;
	forId?: string;
	textKey?: string;
	text?: string;
}

export function FieldLabel(props: FieldLabelProps&StyleLayoutProps) {
	return (
		<label htmlFor={props.forId ?? props.field.FieldId} className={props.id ?? props.classes?.join(" ")} style={ApplyLayoutStyleProps(props)}>
			<FieldLabelText textKey={props.textKey} text={props.text} field={props.field} />
		</label>
	);
}

const FieldLabelText: React.FC<{ textKey?: string; text?: string; field: IEditableField }> = ({ textKey, text, field }) => {
	if (Nullable.HasValue(text)) {
		return <>{text}</>;
	}

	if (Nullable.HasValue(textKey)) {
		return <TranslatedText textKey={textKey} />;
	}

	return <TranslatedText textKey={field.FieldId} />;
};
