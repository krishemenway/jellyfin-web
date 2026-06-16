import * as React from "react";
import Select, { MenuListProps, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useObservable } from "@residualeffect/rereactor";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { ThemeService } from "Themes/ThemeService";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { EditableField } from "Common/EditableField";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface SelectFieldEditorProps<TOption> extends LayoutWithoutChildrenProps {
	className?: string;
	field: EditableField<TOption>;
	allOptions: TOption[];
	getValue: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
}

export function SelectFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): React.ReactNode {
	const value = useObservable(props.field.Current);

	return (
		<select className={props.className} value={props.getValue(value)} onChange={(evt) => { props.field.OnChange(props.allOptions.find((option) => props.getValue(option) === evt.currentTarget.value)!); }} style={ApplyLayoutStyleProps(props)}>
			{props.allOptions.map((option) => <option key={props.getValue(option)} value={props.getValue(option)}>{props.getLabel(option)}</option>)}
		</select>
	);
}

export function AutoCompleteFieldEditor<TOption>(props: SelectFieldEditorProps<TOption>): React.ReactNode {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const current = useObservable(props.field.Current);

	const allOptions = React.useMemo(() => props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) })), [props.allOptions]);
	const selectedOption = React.useMemo(() => Nullable.Value(current, undefined, (c) => allOptions.find((o) => o.value === props.getValue(c))), [allOptions, current]);

	return (
		<Select
			className={props.className}
			options={allOptions}
			value={selectedOption}
			onChange={(newValue) => props.field.OnChange(props.allOptions.find((o) => props.getValue(o) === (newValue as SingleValue<{ value: string; label: string }>)?.value)!)}
			components={{ MenuList: MenuList }}
			menuShouldScrollIntoView
			styles={{
				container: (base) => ({ ...base, width: "100%" }),
				menu: (base) => ({ ...base, backgroundColor: theme.PanelBackgroundColor }),
				option: (base, p) => ({ ...base, backgroundColor: (p.isSelected ? (p.isFocused ? theme.ButtonSelected.Hover : theme.ButtonSelected.Idle) : p.isFocused ? theme.Button.Hover : theme.Button.Idle).BackgroundColor }),
			}}
		/>
	);
};

interface MultiSelectEditorProps<TOption> extends LayoutWithoutChildrenProps {
	className?: string;
	field: EditableField<TOption[]>;
	allOptions: TOption[];
	getValue: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
	createNew?: (value: string) => TOption;
}

export function MultiSelectEditor<TOption>(props: MultiSelectEditorProps<TOption>): React.ReactNode {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const currentValues = useObservable(props.field.Current);

	const allOptionsByValue = React.useMemo(() => Linq.ToRecord(props.allOptions, (o) => props.getValue(o)), [props.allOptions, props.getValue])
	const allOptions = React.useMemo(() => props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) })), [props.allOptions, props.getLabel, props.getValue]);
	const selectedOptions = React.useMemo(() => currentValues.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) })), [currentValues, props.getLabel, props.getValue]);

	if (Nullable.HasValue(props.createNew)) {
		return (
			<CreatableSelect
				id={props.field.FieldId}
				className={props.className}
				isMulti={true}
				isSearchable={true}
				isClearable={false}
				options={allOptions}
				value={selectedOptions}
				onChange={(newValue) => props.field.OnChange(newValue.map((nv) => allOptionsByValue[nv.value] ?? props.createNew!(nv.value.trim())))}
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
	} else {
		return (
			<Select
				id={props.field.FieldId}
				className={props.className}
				isMulti={true}
				isSearchable={true}
				isClearable={false}
				options={allOptions}
				value={selectedOptions}
				onChange={(newValue) => props.field.OnChange(newValue.map((nv) => allOptionsByValue[nv.value]))}
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
	}
};

const MenuList = ({ children, maxHeight }: MenuListProps<{ value: string; label: React.ReactNode }>) => {
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
