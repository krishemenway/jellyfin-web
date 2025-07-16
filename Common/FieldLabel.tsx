import * as React from "react";
import { EditableField } from "Common/EditableField";
import TranslatedText from "Common/TranslatedText";

interface FieldLabelProps {
	className?: string;
	field: EditableField;
}

const FieldLabel: React.ForwardRefRenderFunction<HTMLLabelElement, FieldLabelProps> = (props, ref) => {
	return (
		<label htmlFor={props.field.FieldId} className={props.className} ref={ref}>
			<TranslatedText textKey={props.field.FieldId} />
		</label>
	);
};

const ForwardedFieldLabel = React.forwardRef(FieldLabel);
export default ForwardedFieldLabel;
