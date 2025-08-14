import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { PageTitle } from "Common/PageTitle";
import { Loading } from "Common/Loading";
import { ServerService } from "Servers/ServerService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { SystemInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { LoginService } from "Users/LoginService";
import { useBackgroundStyles } from "AppStyles";

export const ServerDashboard: React.FC = () => {
	React.useEffect(() => ServerService.Instance.LoadServerInfoWithAbort(), []);

	return (
		<PageWithNavigation icon={<ServerIcon />}>
			<PageTitle text={({ Key: "TabServer" })} />
			<Loading
				receivers={[ServerService.Instance.ServerInfo, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
				whenReceived={(server, user) => (
					<Layout direction="column" gap="2em">
						<Layout direction="row" justifyContent="space-between">
							<Layout direction="row" fontSize="2em" className="show-name">{server.ServerName}</Layout>
							<ItemActionsMenu items={[]} actions={[]} user={user} />
						</Layout>
		
						<ServerPaths server={server} />
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

interface ServerDataPoint {
	label: string;
	value: string|undefined|null;
}

const ServerPaths: React.FC<{ server: SystemInfo }> = ({ server }) => {
	const background = useBackgroundStyles();
	const paths: ServerDataPoint[] = [
		{ label: "LabelCache", value: server.CachePath },
		{ label: "LabelLogs", value: server.LogPath },
		{ label: "LabelMetadata", value: server.InternalMetadataPath },
		{ label: "LabelTranscodes", value: server.TranscodingTempPath },
		{ label: "Data", value: server.ProgramDataPath },
		{ label: "LabelWeb", value: server.WebPath },
	];

	return (
		<Layout direction="column" gap="1em" className={background.panel} px="1em" py="1em">
			<TranslatedText textKey="HeaderPaths" elementType="div" layout={{ fontSize: "1.2em" }} />
			<ListOf
				items={paths}
				direction="column" gap="1em"
				forEachItem={(path) => (<Layout key={path.label} gap=".25em" direction="column"><TranslatedText textKey={path.label} elementType="div" /><Layout direction="row">{path.value}</Layout></Layout>)}
			/>
		</Layout>
	);
};
