import * as React from "react";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "./MissingJavascriptFunctions";

export const PageTitle: React.FC<{ text: string|TranslationRequest|undefined|null }> = (props) => {
	if (!Nullable.HasValue(props.text)) {
		return <></>;
	}

	const text = typeof props.text === "string" ? props.text : useTranslatedText(props.text.Key, props.text.KeyProps);
	React.useEffect(() => { document.title = text ?? ""; }, [text]);

	return <></>;
};
