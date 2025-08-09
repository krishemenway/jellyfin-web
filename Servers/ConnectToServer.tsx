import * as React from "react";
import { TranslatedText } from "Common/TranslatedText";
import { TextField } from "Common/TextField";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { Form } from "Common/Form";
import { ServerService } from "Servers/ServerService";
import { FieldLabel } from "Common/FieldLabel";
import { useBackgroundStyles } from "AppStyles";

export const ConnectToServer: React.FC = () => {
	const background = useBackgroundStyles();

	return (
		<Form onSubmit={() => ServerService.Instance.TryAddServer()} direction="column" justifyContent="center" gap="2em" className={background.panel} px="1em" py="1em">
			<Layout elementType="h2" direction="row" fontSize="1.2em"><TranslatedText textKey="HeaderConnectToServer" /></Layout>

			<Layout direction="column" gap=".5em">
				<FieldLabel field={ServerService.Instance.ServerHost} />
				<TextField field={ServerService.Instance.ServerHost} placeholder={{ Key: "LabelServerHostHelp" }} px=".5em" py=".5em" />
			</Layout>

			<Button type="submit" label="Connect" py=".5em" justifyContent="center" />
		</Form>
	);
};
