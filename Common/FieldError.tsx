import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { useBackgroundStyles } from "AppStyles";

interface FieldLabelProps {
	className?: string;
	field: EditableField;
	showErrors: boolean;
}

export const FieldError: React.FC<FieldLabelProps> = (props) => {
	const background = useBackgroundStyles();
	const errorTextKey = useObservable(props.field.ErrorMessage);

	if (!props.showErrors || !Nullable.HasValue(errorTextKey)) {
		return <></>;
	}

	return <TranslatedText textKey={errorTextKey} className={background.error} elementType="p" />;
};
