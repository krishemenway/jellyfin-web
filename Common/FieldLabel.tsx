import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";

interface FieldLabelProps {
	className?: string;
	field: EditableField;
}

const ForwardedFieldLabel: React.ForwardRefRenderFunction<HTMLLabelElement, FieldLabelProps> = (props, ref) => {
	return (
		<label htmlFor={props.field.FieldId} className={props.className} ref={ref}>
			<TranslatedText textKey={props.field.FieldId} />
		</label>
	);
};

export const FieldLabel = React.forwardRef(ForwardedFieldLabel);
