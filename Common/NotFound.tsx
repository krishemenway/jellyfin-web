import * as React from "react";
import Layout from "Common/Layout";
import TranslatedText from "Common/TranslatedText";

const NotFound: React.FC<{ textKey?: string }> = (props) => {
	return <Layout direction="column"><TranslatedText textKey={props.textKey ?? "HeaderPageNotFound"} /></Layout>;
};

export default NotFound;