import * as React from "react";
import Select, { MenuListProps, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useObservable } from "@residualeffect/rereactor";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { ThemeService } from "Themes/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EditableField } from "Common/EditableField";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface SelectFieldEditorProps<TOption, TValue> extends LayoutWithoutChildrenProps {
	classes?: string[];
	field: EditableField<TValue>;
	allOptions: TOption[];
	getKey: (value: TOption) => string|number;
	getValue: (value: TOption) => TValue;
	getLabel: (value: TOption) => React.ReactNode;
}

export function SelectFieldEditor<TOption, TValue>({ field, allOptions, getKey, getValue, getLabel, classes, ...props }: SelectFieldEditorProps<TOption, TValue>): React.ReactNode {
	const value = useObservable(field.Current);
	const optionForValue = allOptions.first(o => getValue(o) === value);

	return (
		<select className={classes?.join(" ")} id={field.FieldId} value={optionForValue !== undefined ? getKey(optionForValue) : undefined} onChange={(evt) => { field.OnChange(getValue(allOptions.single((option) => getKey(option) === evt.currentTarget.value))); }} style={ApplyLayoutStyleProps(props)}>
			{allOptions.map((option) => <option key={getKey(option)} value={getKey(option)}>{getLabel(option)}</option>)}
		</select>
	);
}

export function AutoCompleteFieldEditor<TOption, TValue>(props: SelectFieldEditorProps<TOption, TValue>): React.ReactNode {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const current = useObservable(props.field.Current);
	const currentKey = React.useMemo(() => Nullable.Value(props.allOptions.first(o => props.getValue(o) === current), undefined, o => props.getKey(o)), [props.getKey, props.allOptions, current]);

	const allOptions = React.useMemo(() => props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getKey(o).toString() })), [props.allOptions]);
	const selectedOption = React.useMemo(() => allOptions.first((o) => o.value === currentKey), [props.allOptions, current]);

	return (
		<Select
			className={props.classes?.join(" ")}
			options={allOptions}
			value={selectedOption}
			onChange={(newValue) => props.field.OnChange(props.getValue(props.allOptions.find((o) => props.getKey(o) === (newValue as SingleValue<{ value: string; label: string }>)?.value)!))}
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
	classes?: string[];
	field: EditableField<TOption[]>;
	allOptions: TOption[];
	getValue: (value: TOption) => string;
	getLabel: (value: TOption) => React.ReactNode;
	createNew?: (value: string) => TOption;
}

export function MultiSelectEditor<TOption>(props: MultiSelectEditorProps<TOption>): React.ReactNode {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);
	const currentValues = useObservable(props.field.Current);

	const allOptionsByValue = React.useMemo(() => props.allOptions.toRecord((o) => props.getValue(o)), [props.allOptions, props.getValue])
	const allOptions = React.useMemo(() => props.allOptions.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) })), [props.allOptions, props.getLabel, props.getValue]);
	const selectedOptions = React.useMemo(() => currentValues.map((o) => ({ label: props.getLabel(o), value: props.getValue(o) })), [currentValues, props.getLabel, props.getValue]);

	if (Nullable.HasValue(props.createNew)) {
		return (
			<CreatableSelect
				id={props.field.FieldId}
				className={props.classes?.join(" ")}
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
				className={props.classes?.join(" ")}
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
