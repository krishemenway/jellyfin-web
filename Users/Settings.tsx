import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { Layout } from "Common/Layout";
import { ChangePassword } from "Users/ChangePassword";
import { ChangeTheme } from "Users/ChangeTheme";
import { SettingsIcon } from "Users/SettingsIcon";
import { PageTitle } from "Common/PageTitle";

export const Settings: React.FC = () => {
	return (
		<PageWithNavigation icon={<SettingsIcon />}>
			<PageTitle text={({ Key: "Settings" })} />

			<Layout direction="column">
				<Layout direction="row" gap="1em">
					<ChangePassword />
					<ChangeTheme />
				</Layout>
			</Layout>
		</PageWithNavigation>
	);
};
