import * as React from "react";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";
import { Button } from "Common/Button";
import { CheckIcon } from "CommonIcons/CheckIcon";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { FieldLabel } from "Common/FieldLabel";

interface BaseToggleSwitchProps extends StyleLayoutProps {
	id?: string;
	enabledIcon?: React.ReactNode;
	disabledIcon?: React.ReactNode;
	classes?: string[];
}

export const ToggleSwitch: React.FC<BaseToggleSwitchProps&{ field: EditableField<boolean>; }> = ({ field, ...props }) => {
	const value = useObservable(field.Current);

	return (
		<BaseToggleSwitch
			{...props}
			id={field.FieldId}
			enabled={value}
			onChange={(value) => field.OnChange(value)}
		/>
	);
};

interface ToggleSwitchesProps<TInput, TValue> {
	field: EditableField<TValue[]>;
	allValues: TInput[];
	getLabel: (i: TInput) => string;
	getValue: (i: TInput) => TValue;
	switchWrapperLayout?: StyleLayoutProps;
	switchLayout?: StyleLayoutProps;
	labelLayout?: StyleLayoutProps;
}

export function ToggleSwitches<TInput, TValue = TInput>({ field, allValues, getLabel, getValue, switchWrapperLayout, switchLayout, labelLayout }: ToggleSwitchesProps<TInput, TValue>) {
	const toggledValues = useObservable(field.Current);

	return (
		<>
			{allValues.map(av => (
				<Layout direction="row" key={`${field.FieldId}-${av}`} {...switchWrapperLayout}>
					<BaseToggleSwitch
						id={`${field.FieldId}-${getLabel(av)}`}
						enabled={toggledValues.includes(getValue(av))}
						onChange={() => field.OnChange(toggledValues.toggleItem(getValue(av)))}
						{...switchLayout}
					/>

					<FieldLabel field={field} forId={`${field.FieldId}-${getLabel(av)}`} text={getLabel(av)} {...labelLayout} />
				</Layout>
			))}
		</>
	);
}

export const BaseToggleSwitch: React.FC<BaseToggleSwitchProps&{ enabled: boolean; onChange: (isEnabled: boolean) => void; }> = ({ enabled, onChange, enabledIcon, disabledIcon, ...props }) => {
	return (
		<Button type="button" onClick={() => onChange(!enabled)} {...props}>
			{enabled ? (enabledIcon ?? <CheckIcon />) : (disabledIcon ?? <CheckIcon opacity={0} />)}
		</Button>
	);
};
