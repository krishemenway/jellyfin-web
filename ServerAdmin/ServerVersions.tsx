import * as React from "react";
import { Layout } from "Common/Layout";
import { SystemInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { TranslatedText } from "Common/TranslatedText";

interface Statistic {
	label: string;
	value?: string|null;
}

export const ServerVersions: React.FC<{ server: SystemInfo }> = (props) => {
	const stats: Statistic[] = [
		{ label: "LabelServerVersion", value: props.server.Version },
		{ label: "LabelWebVersion", value: props.server.Version },
	];

	return (
		<Layout direction="row" width="100%">
			{stats.map((s) => (<ServerStatistic key={s.label} statistic={s} />))}
		</Layout>
	);
}

const ServerStatistic: React.FC<{ statistic: Statistic }> = (props) => {
	return (
		<Layout direction="row" gap="2em">
			<TranslatedText textKey={props.statistic.label} />
			<Layout direction="row">{props.statistic.value}</Layout>
		</Layout>
	);
};
