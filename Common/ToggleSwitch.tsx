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
		<Button
			type="button"
			width="1.5em" height="1.5em"
			alignItems="center" justifyContent="center"
			id={props.field.FieldId}
			onClick={() => props.field.Current.Value = !props.field.Current.Value}>
			{value ? <CheckIcon /> : <>&nbsp;</>}
		</Button>
	);
};
