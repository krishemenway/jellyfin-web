import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";

export const LoadingErrorMessages: React.FC<{ errorTextKeys: string[] }> = ({ errorTextKeys }) => {
	return (
		<ListOf
			items={errorTextKeys.distinct()}
			direction="column" gap="1em"
			forEachItem={(textKey) => <TranslatedText key={textKey} textKey={textKey} />}
		/>
	);
};
