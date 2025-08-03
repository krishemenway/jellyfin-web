import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { Layout } from "Common/Layout";
import { ChangePassword } from "Users/ChangePassword";
import { TranslatedText } from "Common/TranslatedText";
import { SettingsIcon } from "Users/SettingsIcon";
import { PageTitle } from "Common/PageTitle";

export const Settings: React.FC = () => {
	return (
		<PageWithNavigation icon={<SettingsIcon size={24} />}>
			<PageTitle text={({ Key: "Settings" })} />
			<Layout direction="column">
				<Layout direction="row" gap={16}>
					<TranslatedText textKey="LabelCurrentPassword" elementType="div" layout={{ alignSelf: "end" }} />
					<ChangePassword />
				</Layout>
			</Layout>
		</PageWithNavigation>
	);
};
