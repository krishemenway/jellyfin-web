import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";

export const LoadingErrorMessages: React.FC<{ errorTextKeys: string[] }> = (props) => {
	return (
		<ListOf
			items={props.errorTextKeys}
			direction="column" gap={16}
			forEachItem={(textKey) => <TranslatedText textKey={textKey} />}
		/>
	);
};
