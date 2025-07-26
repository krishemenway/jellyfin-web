import * as React from "react";
import { SelectField } from "Common/SelectField";

interface SelectFieldEditorProps<TOption> {
	className?: string;
	field: SelectField<TOption>,
	getKey: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
}

export function SelectFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): JSX.Element {
	return (
		<select className={props.className} onChange={(evt) => { props.field.OnChange(props.field.AllOptions.find((option) => props.getKey(option) === evt.currentTarget.value)!); }}>
			{props.field.AllOptions.map((option) => <option key={props.getKey(option)} value={props.getKey(option)}>{props.getLabel(option)}</option>)}
		</select>
	);
}
