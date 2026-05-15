import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { PageTitle } from "Common/PageTitle";
import { Loading } from "Common/Loading";
import { ServerService } from "Servers/ServerService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { ServerPaths } from "ServerAdmin/ServerPaths";
import { ServerStatistics } from "ServerAdmin/ServerStatistics";
import { EditGeneralSettingsModal } from "ServerAdmin/GeneralSettingsService";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";
import { ServerControls } from "ServerAdmin/ServerControls";
import { ServerScheduledTasks } from "ServerAdmin/ServerScheduledTasks";
import { ServerDevices } from "ServerAdmin/ServerDevices";

export const ServerDashboard: React.FC = () => {
	React.useEffect(() => ServerService.Instance.LoadServerInfoWithAbort(), []);
	React.useEffect(() => LocalizationOptionsStore.Instance.Load(), []);

	return (
		<PageWithNavigation icon={<ServerIcon />}>
			<PageTitle text={({ Key: "TabServer" })} suppressOnScreen />

			<Loading
				receivers={[ServerService.Instance.ServerInfo]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="3rem" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="3rem" />}
				whenReceived={(server) => (
					<Layout direction="column" gap="2rem" my="1rem">
						<Layout direction="row" justifyContent="space-between">
							<Layout direction="row" fontSize="2rem" className="server-name">{server.ServerName}</Layout>
						</Layout>
		
						<Layout direction="row" gap="1rem">
							<Layout direction="column" gap="1rem">
								<ServerControls />
								<ServerStatistics />
							</Layout>

							<ServerPaths />
							<ServerScheduledTasks />
							<ServerDevices />
						</Layout>
					</Layout>
				)}
			/>

			<EditGeneralSettingsModal />
		</PageWithNavigation>
	);
};
