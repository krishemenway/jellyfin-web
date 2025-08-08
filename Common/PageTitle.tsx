import * as React from "react";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";

export const PageTitle: React.FC<{ text: string|TranslationRequest|undefined|null }> = (props) => {
	if (!Nullable.HasValue(props.text)) {
		return <></>;
	}

	const text = typeof props.text === "string" ? props.text : useTranslatedText(props.text.Key, props.text.KeyProps) ?? "";
	React.useEffect(() => { document.title = ServerService.Instance.CurrentServer.Name + " | " + text; }, [text, ServerService.Instance.CurrentServer.Name]);

	return <></>;
};
