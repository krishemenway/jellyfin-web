import { useObservable } from "@residualeffect/rereactor";
import { Button } from "Common/Button";
import { FieldError } from "Common/FieldError";
import { FieldLabel } from "Common/FieldLabel";
import { Form } from "Common/Form";
import { Layout } from "Common/Layout";
import { useDataOrNull, useError, useIsBusy } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { Receiver } from "Common/Receiver";
import { RequestError } from "Common/RequestError";
import { TextField } from "Common/TextField";
import { TranslatedText } from "Common/TranslatedText";
import * as React from "react";
import { QuickConnectService } from "Users/QuickConnect";

export const AuthorizeQuickConnect: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
	const showErrors = useObservable(QuickConnectService.Instance.ShowErrors);
	const isBusy = useIsBusy(QuickConnectService.Instance.AuthorizeResult as Receiver<unknown>);
	const submitError = useError(QuickConnectService.Instance.AuthorizeResult as Receiver<unknown>);
	const isSuccessful = useDataOrNull(QuickConnectService.Instance.AuthorizeResult);

	React.useEffect(() => QuickConnectService.Instance.ResetFormOnClosed(), [open]);

	if (isSuccessful === true) {
		return (
			<Layout direction="column" px="1em" py="1em" gap="1em" maxWidth="20em">
				<TranslatedText textKey="QuickConnect" elementType="h2" layout={{ fontSize: "1.2em" }} />

				<TranslatedText textKey="QuickConnectDescription" elementType="p" layout={{ fontSize: "0.9em" }} />

				<TranslatedText textKey="QuickConnectAuthorizeSuccess" />
				<Button type="button" px=".5em" py=".25em" justifyContent="center" label="ButtonOk" onClick={() => onClose()} />
			</Layout>
		);
	}

	return (
		<Form direction="column" px="1em" py="1em" gap="1em" maxWidth="20em" onSubmit={(() => QuickConnectService.Instance.AuthorizeQuickConnect())}>
			<TranslatedText textKey="QuickConnect" elementType="h2" layout={{ fontSize: "1.2em" }} />

			<TranslatedText textKey="QuickConnectDescription" elementType="p" layout={{ fontSize: "0.9em" }} />

			<FieldLabel field={QuickConnectService.Instance.QuickConnectCode} />
			<TextField field={QuickConnectService.Instance.QuickConnectCode} px=".5em" py=".25em" />
			<FieldError field={QuickConnectService.Instance.QuickConnectCode} showErrors={showErrors} />

			<RequestError errorKey={submitError} showErrors={showErrors} />
			<Button type="submit" px=".5em" py=".25em" justifyContent="center" label="Authorize" icon={isBusy ? <LoadingIcon /> : <></>}  />
		</Form>
	);
};
