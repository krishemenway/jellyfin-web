import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";

interface SelectFieldProps {
	className?: string;
	field: EditableField,
	options: { label: string, labelTextProps?: string[], value: string }[],
}

const ForwardedSelectField: React.ForwardRefRenderFunction<HTMLSelectElement, SelectFieldProps> = (props, ref) => {
	return (
		<select className={props.className} ref={ref}>
			{props.options.map((o) => <option value={o.value}><TranslatedText textKey={o.label} textProps={o.labelTextProps} /></option>)}
		</select>
	);
};

export const SelectField = React.forwardRef(ForwardedSelectField);
