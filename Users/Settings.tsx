import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import Layout from "Common/Layout";
import ChangePassword from "Users/ChangePassword";
import TranslatedText from "Common/TranslatedText";
import SettingsIcon from "Users/SettingsIcon";

const Settings: React.FC = () => {
	return (
		<PageWithNavigation icon={<SettingsIcon size={24} />}>
			<Layout direction="column">
				<Layout direction="row" gap={16}>
					<Layout direction="row" alignSelf="end"><TranslatedText textKey="LabelCurrentPassword" /></Layout>
					<Layout direction="column"><ChangePassword /></Layout>
				</Layout>
			</Layout>
		</PageWithNavigation>
	);
};

export default Settings;
