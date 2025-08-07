import * as React from "react";
import Select from "react-select";
import { useObservable } from "@residualeffect/rereactor";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { ThemeService } from "Users/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EditableField } from "Common/EditableField";

interface SelectFieldEditorProps<TOption> extends LayoutWithoutChildrenProps {
	className?: string;
	field: EditableField<TOption>;
	allOptions: TOption[];
	getKey: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
}

export function SelectFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): JSX.Element {
	return (
		<select className={props.className} onChange={(evt) => { props.field.OnChange(props.allOptions.find((option) => props.getKey(option) === evt.currentTarget.value)!); }} style={ApplyLayoutStyleProps(props)}>
			{props.allOptions.map((option) => <option key={props.getKey(option)} value={props.getKey(option)}>{props.getLabel(option)}</option>)}
		</select>
	);
}

export function AutoCompleteFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): JSX.Element {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const current = useObservable(props.field.Current);

	return (
		<Select
			value={Nullable.ValueOrDefault(current, undefined, (c) => ({ label: props.getLabel(c), value: props.getKey(c) }))}
			styles={{
				menu: (base) => ({ ...base, backgroundColor: theme.PanelBackgroundColor }),
				option: (base, p) => ({ ...base, backgroundColor: (p.isSelected ? (p.isFocused ? theme.ButtonSelected.Hover : theme.ButtonSelected.Idle) : p.isFocused ? theme.Button.Hover : theme.Button.Idle).BackgroundColor }),
			}}
			options={props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getKey(o) }))}
			onChange={(newValue) => props.field.OnChange(props.allOptions.find((o) => props.getKey(o) === newValue?.value)!)}
		/>
	);
};
