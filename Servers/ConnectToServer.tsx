import * as React from "react";
import { useBackgroundStyles } from "AppStyles";
import { TranslatedText } from "Common/TranslatedText";
import { TextField } from "Common/TextField";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { Form } from "Common/Form";
import { ServerService } from "Servers/ServerService";
import { FieldLabel } from "Common/FieldLabel";
import { FieldError } from "Common/FieldError";
import { useObservable } from "@residualeffect/rereactor";
import { useError } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import { RequestError } from "Common/RequestError";

export const ConnectToServer: React.FC<{ open: boolean }> = ({ open }) => {
	const background = useBackgroundStyles();
	const showErrors = useObservable(ServerService.Instance.TryAddServerErrorMessagesShown);
	const submitError = useError(ServerService.Instance.TryAddServerResult as Receiver<unknown>);

	React.useEffect(() => ServerService.Instance.ResetTryAddServer(), [open]);

	return (
		<Form onSubmit={() => ServerService.Instance.TryAddServer()} direction="column" justifyContent="center" gap="2em" className={background.panel} px="1em" py="1em">
			<Layout elementType="h2" direction="row" fontSize="1.2em"><TranslatedText textKey="HeaderConnectToServer" /></Layout>

			<Layout direction="column" gap=".5em">
				<FieldLabel field={ServerService.Instance.TryAddServerHost} />
				<TextField field={ServerService.Instance.TryAddServerHost} placeholder={{ Key: "LabelServerHostHelp" }} px=".5em" py=".5em" />
				<FieldError field={ServerService.Instance.TryAddServerHost} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".25em">
				<RequestError errorKey={submitError} showErrors={showErrors} />
				<Button type="submit" label="Connect" py=".5em" justifyContent="center" />
			</Layout>
		</Form>
	);
};
