import * as React from "react";
import { TranslatedText } from "Common/TranslatedText";
import { Layout } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";

interface RequestErrorProps {
	className?: string;
	errorKey: string;
	showErrors: boolean;
}

export const RequestError: React.FC<RequestErrorProps> = (props) => {
	const background = useBackgroundStyles();

	if (!props.showErrors) {
		return <></>;
	}

	return <Layout className={background.error} direction="row"><TranslatedText textKey={props.errorKey} /></Layout>;
};
