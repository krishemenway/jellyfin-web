import * as React from "react";
import TranslatedText from "Common/TranslatedText";
import TextField from "Common/TextField";
import Layout from "Common/Layout";
import Button from "Common/Button";
import Form from "Common/Form";
import { ServerService } from "Servers/ServerService";
import FieldLabel from "Common/FieldLabel";
import { useBackgroundStyles } from "Common/AppStyles";

const ConnectToServer: React.FC = () => {
	const background = useBackgroundStyles();

	return (
		<Form onSubmit={() => ServerService.Instance.TryAddServer()} direction="column" justifyContent="center" gap={32} className={background.panel} px={16} py={16} my={32}>
			<Layout elementType="h2" direction="row"><TranslatedText textKey="HeaderConnectToServer" /></Layout>

			<Layout direction="column" gap={8}>
				<FieldLabel field={ServerService.Instance.ServerHost} />
				<TextField field={ServerService.Instance.ServerHost} />
				<Layout direction="row"><TranslatedText textKey="LabelServerHostHelp" /></Layout>
			</Layout>

			<Button type="submit" label="Connect" px={8} py={4} />
		</Form>
	);
};

export default ConnectToServer;
