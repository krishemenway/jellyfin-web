import * as React from "react";
import { Button } from "Common/Button";
import { Checkbox } from "Common/Checkbox";
import { TranslatedText } from "Common/TranslatedText";
import { TextField } from "Common/TextField";
import { useBackgroundStyles } from "AppStyles";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { LoginService } from "Users/LoginService";
import { JellyfinIcon } from "CommonIcons/JellyfinIcon";
import { CenteredModal } from "Common/Modal";
import { useObservable } from "@residualeffect/rereactor";
import { FieldLabel } from "Common/FieldLabel";
import { Form } from "Common/Form";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";

const SignInWithQuickConnect: React.FC = () => {
	React.useEffect(() => { return () => LoginService.Instance.Dispose(); }, []);

	return (
		<Layout direction="column" gap="1em" px="1em" py="1em">
			<Layout direction="row"><TranslatedText textKey="QuickConnect" /></Layout>

			<Loading
				receivers={[LoginService.Instance.QuickConnectResult]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenNotStarted={<StartQuickConnect />}
				whenLoading={<LoadingIcon size="3em" />}
				whenReceived={(result) => <ReceivedQuickConnectResult code={result.Code} />}
			/>
		</Layout>
	);
};

const ReceivedQuickConnectResult: React.FC<{ code?: string }> = (props) => {
	if (!Nullable.HasValue(props.code)) {
		return <LoadingErrorMessages errorTextKeys={["UnknownError"]} />
	}

	return (
		<Loading
			receivers={[LoginService.Instance.AuthenticationResponse]}
			whenNotStarted={<WaitingForQuickConnectAuthenticationView code={props.code} />}
			whenLoading={<WaitingForQuickConnectAuthenticationView code={props.code} />}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenReceived={() => <></>}
		/>
	);
}

const WaitingForQuickConnectAuthenticationView: React.FC<{ code: string; }> = (props) => {
	return (
		<Layout direction="row"><TranslatedText textKey="QuickConnectAuthorizeCode" textProps={[props.code]} /></Layout>
	);
};

const StartQuickConnect: React.FC = () => {
	return (
		<Layout direction="column">
			<Button direction="row" type="button" px=".5em" py=".25em" onClick={() => LoginService.Instance.FindQuickConnectTokenAndBeginWaitingForAuthentication()} label="LabelQuickConnectCode" />
		</Layout>
	);
}

const SignInWithCredentials: React.FC = () => {
	const background = useBackgroundStyles();
	const showForgotPassword = useObservable(LoginService.Instance.ShowForgotPassword);

	return (
		<>
			<Form onSubmit={() => LoginService.Instance.SignInWithCredentials()} direction="column" gap="1em" px="1em" py="1em">
				<Layout direction="column" gap=".5em">
					<FieldLabel field={LoginService.Instance.UserName} />
					<TextField field={LoginService.Instance.UserName} />
				</Layout>

				<Layout direction="column" gap=".5em">
					<FieldLabel field={LoginService.Instance.Password} />
					<TextField password field={LoginService.Instance.Password} />
				</Layout>

				<Layout direction="row" gap=".5em" alignItems="center">
					<Checkbox field={LoginService.Instance.RememberMe} />
					<FieldLabel field={LoginService.Instance.RememberMe} />
				</Layout>

				<Button direction="row" label="ButtonSignIn" type="submit" justifyContent="center" px=".5em" py=".25em" />
				<Button direction="row" label="ButtonForgotPassword" type="button" justifyContent="center" px=".5em" py=".25em" onClick={() => { LoginService.Instance.ShowForgotPassword.Value = true; }} />
			</Form>

			<CenteredModal open={showForgotPassword} onClosed={() => { LoginService.Instance.ShowForgotPassword.Value = false; }}>
				<Form onSubmit={() => LoginService.Instance.SubmitForgotPassword()} direction="column" className={background.alternatePanel} gap="2em" px="1em" py="1em">
					<Layout direction="row"><TranslatedText textKey="ButtonForgotPassword" /></Layout>

					<Layout direction="column" gap=".5em">
						<TextField field={LoginService.Instance.UserName} />
						<Layout direction="row"><TranslatedText textKey="LabelForgotPasswordUsernameHelp" /></Layout>
					</Layout>

					<Layout direction="column" gap=".5em">
						<Button direction="row" type="submit" label="ButtonSubmit" px=".5em" py=".25em" />
						<Button direction="row" type="button" label="ButtonCancel" px=".5em" py=".25em" onClick={() => { LoginService.Instance.ShowForgotPassword.Value = false; }} />
					</Layout>
				</Form>
			</CenteredModal>
		</>
	);
};

export const Login: React.FC = () => {
	const background = useBackgroundStyles();

	return (
		<Layout direction="column" gap="1em" alignItems="center" py="2em">
			<JellyfinIcon size="2em" />
			<Layout direction="column" fontSize="1.5em">{ServerService.Instance.CurrentServer.Name}</Layout>
			<Layout direction="column" className={background.panel}><SignInWithCredentials /></Layout>
			<Layout direction="column" className={background.panel}><SignInWithQuickConnect /></Layout>
		</Layout>
	);
};
