import * as React from "react";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";
import { Button } from "Common/Button";
import { CheckIcon } from "CommonIcons/CheckIcon";
import { StyleLayoutProps } from "Common/Layout";

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

export const BaseToggleSwitch: React.FC<BaseToggleSwitchProps&{ enabled: boolean; onChange: (isEnabled: boolean) => void; }> = ({ enabled, onChange, enabledIcon, disabledIcon, ...props }) => {
	return (
		<Button type="button" onClick={() => onChange(!enabled)} {...props}>
			{enabled ? (enabledIcon ?? <CheckIcon />) : (disabledIcon ?? <CheckIcon opacity={0} />)}
		</Button>
	);
};
