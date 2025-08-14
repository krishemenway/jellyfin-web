import * as React from "react";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { useDataOrNull } from "Common/Loading";

export const PageTitle: React.FC<{ text: string|TranslationRequest|undefined|null }> = (props) => {
	if (!Nullable.HasValue(props.text)) {
		return <></>;
	}

	const server = useDataOrNull(ServerService.Instance.ServerInfo);
	const text = typeof props.text === "string" ? props.text : useTranslatedText(props.text) ?? "";

	React.useEffect(() => { document.title = text + Nullable.ValueOrDefault(server, "", (s) => ` | ${s.ServerName}`); }, [text, server]);

	return <></>;
};
