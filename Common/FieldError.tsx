import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Layout } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";

interface FieldLabelProps {
	className?: string;
	field: EditableField;
	showErrors: boolean;
}

export const FieldError: React.FC<FieldLabelProps> = (props) => {
	const background = useBackgroundStyles();
	const errorTextKey = useObservable(props.field.ErrorMessage);

	if (!Nullable.StringHasValue(errorTextKey) || !props.showErrors) {
		return <></>;
	}

	return <Layout className={background.error} direction="row"><TranslatedText textKey={errorTextKey} /></Layout>;
};
