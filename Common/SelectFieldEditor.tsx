import * as React from "react";
import Select, { MenuListProps, SingleValue } from "react-select";
import { useObservable } from "@residualeffect/rereactor";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { ThemeService } from "Users/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EditableField } from "Common/EditableField";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface SelectFieldEditorProps<TOption> extends LayoutWithoutChildrenProps {
	className?: string;
	field: EditableField<TOption>;
	allOptions: TOption[];
	getValue: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
}

export function SelectFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): JSX.Element {
	return (
		<select className={props.className} onChange={(evt) => { props.field.OnChange(props.allOptions.find((option) => props.getValue(option) === evt.currentTarget.value)!); }} style={ApplyLayoutStyleProps(props)}>
			{props.allOptions.map((option) => <option key={props.getValue(option)} value={props.getValue(option)}>{props.getLabel(option)}</option>)}
		</select>
	);
}

export function AutoCompleteFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): JSX.Element {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const current = useObservable(props.field.Current);

	const allOptions = props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) }));
	const selectedOption = Nullable.Value(current, undefined, (c) => allOptions.find((o) => o.value === props.getValue(c)));

	return (
		<Select
			options={allOptions}
			value={selectedOption}
			onChange={(newValue) => props.field.OnChange(props.allOptions.find((o) => props.getValue(o) === (newValue as SingleValue<{ value: string; label: string }>)?.value)!)}
			components={{ MenuList: MenuList }}
			styles={{
				container: (base) => ({ ...base, width: "100%" }),
				menu: (base) => ({ ...base, backgroundColor: theme.PanelBackgroundColor }),
				option: (base, p) => ({ ...base, backgroundColor: (p.isSelected ? (p.isFocused ? theme.ButtonSelected.Hover : theme.ButtonSelected.Idle) : p.isFocused ? theme.Button.Hover : theme.Button.Idle).BackgroundColor }),
			}}
		/>
	);
};

const SplitCharacter = "|";
export function MultiSelectEditor(props: SelectFieldEditorProps<string>): JSX.Element {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const currentValues = useObservable(props.field.Current).split(SplitCharacter);

	const allOptions = props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) }));
	const selectedOptions = allOptions.filter((o) => currentValues.includes(o.value));

	return (
		<Select
			isMulti={true}
			options={allOptions}
			value={selectedOptions}
			onChange={(newValue) => props.field.OnChange(newValue.map((v) => v.value).join(SplitCharacter))}
			components={{ MenuList: MenuList }}
			styles={{
				container: (base) => ({ ...base, width: "100%" }),
				multiValueLabel: (base) => ({ ...base, color: "inherit", padding: ".5em" }),
				multiValue: (base) => ({ ...base, backgroundColor: theme.AlternateBackgroundColor, color: theme.PrimaryTextColor }),
				menu: (base) => ({ ...base, backgroundColor: theme.PanelBackgroundColor }),
				option: (base, p) => ({ ...base, backgroundColor: (p.isSelected ? (p.isFocused ? theme.ButtonSelected.Hover : theme.ButtonSelected.Idle) : p.isFocused ? theme.Button.Hover : theme.Button.Idle).BackgroundColor }),
			}}
		/>
	);
};

export const MenuList = ({ children, maxHeight }: MenuListProps<{ value: string; label: React.ReactNode }>) => {
	const ref = React.useRef<VirtuosoHandle>(null);

	if (!Array.isArray(children)) {
		return <></>;
	}

	return (
		<Virtuoso
			ref={ref}
			totalCount={React.Children.count(children)}
			itemContent={(index) => children[index]}
			style={{ height: maxHeight }}
		/>
	);
};
