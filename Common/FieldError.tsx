import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface FieldLabelProps<T> {
	classes?: string[];
	field: EditableField<T>;
	showErrors: boolean;
}

export function FieldError<T>(props: FieldLabelProps<T>): React.ReactNode {
	const errorTextKey = useObservable(props.field.ErrorMessage);

	if (!props.showErrors || !Nullable.HasValue(errorTextKey)) {
		return <></>;
	}

	return <TranslatedText textKey={errorTextKey} classes={props.classes} layout={{ fontColor: "Error" }} elementType="p" />;
}
