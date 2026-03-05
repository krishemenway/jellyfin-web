import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { PageTitle } from "Common/PageTitle";
import { Loading } from "Common/Loading";
import { ServerService } from "Servers/ServerService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { LoginService } from "Users/LoginService";
import { ServerPaths } from "ServerAdmin/ServerPaths";
import { ServerVersions } from "ServerAdmin/ServerVersions";
import { ServerLibraries } from "ServerAdmin/ServerLibraries";
import { EditGeneralSettingsModal } from "ServerAdmin/GeneralSettingsService";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";

export const ServerDashboard: React.FC = () => {
	React.useEffect(() => ServerService.Instance.LoadServerInfoWithAbort(), []);
	React.useEffect(() => LocalizationOptionsStore.Instance.Load(), []);

	return (
		<PageWithNavigation icon={<ServerIcon />}>
			<PageTitle text={({ Key: "TabServer" })} suppressOnScreen />

			<Loading
				receivers={[ServerService.Instance.ServerInfo, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="3rem" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="3rem" />}
				whenReceived={(server, user) => (
					<Layout direction="column" gap="2rem" my="1rem">
						<Layout direction="row" justifyContent="space-between">
							<Layout direction="row" fontSize="2rem" className="server-name">{server.ServerName}</Layout>
							<ItemActionsMenu items={[]} actions={[]} user={user} />
						</Layout>
		
						<Layout direction="row" gap="1rem">
							<ServerVersions server={server} />
							<ServerLibraries />
							<ServerPaths />
						</Layout>
					</Layout>
				)}
			/>

			<EditGeneralSettingsModal />
		</PageWithNavigation>
	);
};
