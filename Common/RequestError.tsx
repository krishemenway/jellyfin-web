import * as React from "react";
import { TranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { Nullable } from "./MissingJavascriptFunctions";

interface RequestErrorProps {
	className?: string;
	errorKey?: string;
	showErrors: boolean;
}

export const RequestError: React.FC<RequestErrorProps> = (props) => {
	const background = useBackgroundStyles();

	if (!props.showErrors || !Nullable.HasValue(props.errorKey)) {
		return <></>;
	}

	return <TranslatedText textKey={props.errorKey} elementType="p" className={background.error} />;
};
