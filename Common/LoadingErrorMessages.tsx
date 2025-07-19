import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";

export const LoadingErrorMessages: React.FC<{ errorTextKeys: string[] }> = (props) => {
	return (
		<ListOf
			items={props.errorTextKeys}
			createKey={(textKey) => textKey}
			renderItem={(textKey) => <TranslatedText textKey={textKey} />}
			listLayout={{ direction: "column", gap: 16 }}
		/>
	);
};
