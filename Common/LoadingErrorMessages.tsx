import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { Linq } from "Common/MissingJavascriptFunctions";

export const LoadingErrorMessages: React.FC<{ errorTextKeys: string[] }> = (props) => {
	return (
		<ListOf
			items={Linq.Distinct(props.errorTextKeys)}
			direction="column" gap="1em"
			forEachItem={(textKey) => <TranslatedText key={textKey} textKey={textKey} />}
		/>
	);
};
