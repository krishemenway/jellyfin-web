import * as React from "react";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";

export interface CheckBoxProps {
	field: EditableField;
	className?: string;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
	const value = useObservable(props.field.Current);

	return (
		<input
			type="checkbox"
			id={props.field.FieldId}
			value={value}
			className={props.className}
			onChange={(evt) => props.field.OnChange(evt.target.value)}
		/>
	);
};

export default CheckBox;
