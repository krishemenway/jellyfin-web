import * as React from "react";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";
import { Button } from "Common/Button";
import { CheckIcon } from "CommonIcons/CheckIcon";

export interface ToggleSwitchProps {
	field: EditableField<boolean>;
	className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
	const value = useObservable(props.field.Current);

	return (
		<BaseToggleSwitch
			enabled={value}
			id={props.field.FieldId}
			onChange={(value) => props.field.OnChange(value)}
		/>
	);
};

export const BaseToggleSwitch: React.FC<{ id?: string; enabled: boolean; onChange: (isEnabled: boolean) => void; }> = ({ id, enabled, onChange }) => {
	return (
		<Button
			type="button"
			width="1.5em" height="1.5em"
			alignItems="center" justifyContent="center"
			id={id}
			onClick={() => onChange(!enabled)}>
			{enabled ? <CheckIcon /> : <>&nbsp;</>}
		</Button>
	);
};
