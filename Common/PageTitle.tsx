import * as React from "react";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { useDataOrNull } from "Common/Loading";
import { Layout } from "Common/Layout";

export const PageTitle: React.FC<{ text: string|TranslationRequest|undefined|null; suppressOnScreen?: true }> = (props) => {
	if (!Nullable.HasValue(props.text)) {
		return <></>;
	}

	const server = useDataOrNull(ServerService.Instance.ServerInfo);
	const text = typeof props.text === "string" ? props.text : useTranslatedText(props.text) ?? "";

	React.useEffect(() => { document.title = text + Nullable.Value(server, "", (s) => ` | ${s.ServerName}`); }, [text, server]);

	if (props.suppressOnScreen === true) {
		return <></>;
	}

	return <Layout direction="row" fontSize="1.5em" elementType="h1">{text}</Layout>;
};
