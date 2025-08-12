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

	const allOptions = props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getKey(o) }));
	const selectedOption = Nullable.ValueOrDefault(current, undefined, (c) => allOptions.find((o) => o.value === props.getKey(c)));

	return (
		<Select
			options={allOptions}
			value={selectedOption}
			onChange={(newValue) => props.field.OnChange(props.allOptions.find((o) => props.getKey(o) === (newValue as SingleValue<{ value: string; label: string }>)?.value)!)}
			components={{ MenuList: MenuList }}
			styles={{
				container: (base) => ({ ...base, width: "100%" }),
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
