import * as React from "react";
import { PageWithNavigation } from "PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";
import { ServerPaths } from "ServerAdmin/ServerPaths";
import { ServerStatistics } from "ServerAdmin/ServerStatistics";
import { EditGeneralSettingsModal } from "ServerAdmin/GeneralSettingsService";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";
import { ServerControls } from "ServerAdmin/ServerControls";
import { ServerScheduledTasks } from "ServerAdmin/ServerScheduledTasks";
import { ServerDevices } from "ServerAdmin/ServerDevices";

export const ServerDashboard: React.FC = () => {
	React.useEffect(() => LocalizationOptionsStore.Instance.Load(), []);

	return (
		<PageWithNavigation icon={<ServerIcon />} content={(_1, _2, _3, server) => (
			<Layout direction="column" gap="2rem" my="1rem">
				<PageTitle text={({ Key: "TabServer" })} suppressOnScreen />

				<Layout direction="row" justifyContent="space-between">
					<Layout direction="row" fontSizeREM={2} classes={["server-name"]}>{server.ServerName}</Layout>
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

				<EditGeneralSettingsModal />
			</Layout>
		)} />
	);
};
