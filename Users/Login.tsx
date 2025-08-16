import * as React from "react";
import { Button } from "Common/Button";
import { Checkbox } from "Common/Checkbox";
import { TranslatedText } from "Common/TranslatedText";
import { TextField } from "Common/TextField";
import { useBackgroundStyles } from "AppStyles";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { LoginService } from "Users/LoginService";
import { JellyfinIcon } from "CommonIcons/JellyfinIcon";
import { CenteredModal } from "Common/Modal";
import { useObservable } from "@residualeffect/rereactor";
import { FieldLabel } from "Common/FieldLabel";
import { Form } from "Common/Form";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { ChangeServerButton } from "Servers/ChangeServerButton";
import { QuickConnectService } from "./QuickConnect";

const SignInWithQuickConnect: React.FC = () => {
	React.useEffect(() => { return () => QuickConnectService.Instance.Dispose(); }, []);

	return (
		<Layout direction="column" gap="1em" px="1em" py="1em">
			<Layout direction="row"><TranslatedText textKey="QuickConnect" /></Layout>

			<Loading
				receivers={[QuickConnectService.Instance.QuickConnectResult]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenNotStarted={<StartQuickConnect />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
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
			<Button direction="row" type="button" px=".5em" py=".25em" onClick={() => QuickConnectService.Instance.FindQuickConnectTokenAndBeginWaitingForAuthentication()} label="LabelQuickConnectCode" />
		</Layout>
	);
}

const SignInWithCredentials: React.FC = () => {
	const background = useBackgroundStyles();
	const showForgotPassword = useObservable(LoginService.Instance.ShowForgotPassword);

	return (
		<Layout direction="column" className={background.panel} gap="1.25em" py="1em" px="1em">
			<Form onSubmit={() => { LoginService.Instance.SignInWithCredentials(); }} direction="column" gap="1.25em">
				<Layout direction="column" gap=".5em">
					<FieldLabel field={LoginService.Instance.UserName} />
					<TextField field={LoginService.Instance.UserName} px=".25em" py=".25em" />
				</Layout>

				<Layout direction="column" gap=".5em">
					<FieldLabel field={LoginService.Instance.Password} />
					<TextField password field={LoginService.Instance.Password} px=".25em" py=".25em" />
				</Layout>

				<Layout direction="row" gap=".5em" alignItems="center">
					<Checkbox field={LoginService.Instance.RememberMe} />
					<FieldLabel field={LoginService.Instance.RememberMe} />
				</Layout>

				<Layout direction="column" gap=".5em">
					<Button direction="row" label="ButtonSignIn" type="submit" justifyContent="center" py=".5em" />
				</Layout>
			</Form>

			<Button direction="row" label="ButtonForgotPassword" type="button" justifyContent="center" py=".5em" onClick={() => { LoginService.Instance.ShowForgotPassword.Value = true; }} />
			<ChangeServerButton justifyContent="center" py=".5em" withoutIcon />

			<CenteredModal open={showForgotPassword} onClosed={() => { LoginService.Instance.ShowForgotPassword.Value = false; }}>
				<Form onSubmit={() => { LoginService.Instance.SubmitForgotPassword(); }} direction="column" className={background.alternatePanel} gap="2em" px="1em" py="1em">
					<Layout direction="row"><TranslatedText textKey="ButtonForgotPassword" /></Layout>

					<Layout direction="column" gap=".5em">
						<TextField field={LoginService.Instance.UserName} px=".25em" py=".25em" />
						<Layout direction="row"><TranslatedText textKey="LabelForgotPasswordUsernameHelp" /></Layout>
					</Layout>

					<Layout direction="row" gap=".5em" justifyContent="end">
						<Button direction="row" type="button" label="ButtonCancel" justifyContent="center" px="1em" py=".5em" onClick={() => { LoginService.Instance.ShowForgotPassword.Value = false; }} />
						<Button direction="row" type="submit" label="ButtonSubmit" justifyContent="center" px="1em" py=".5em" />
					</Layout>
				</Form>
			</CenteredModal>
		</Layout>
	);
};

export const Login: React.FC<StyleLayoutProps> = (props) => {
	const background = useBackgroundStyles();

	React.useEffect(() => QuickConnectService.Instance.LoadQuickConnectEnabled(), []);

	return (
		<Layout direction="column" gap="1em" alignItems="center" py="2em" {...props}>
			<JellyfinIcon size="2em" />
			<Layout direction="column" fontSize="1.5em">{ServerService.Instance.CurrentServer.Name}</Layout>
			<SignInWithCredentials />
			<Loading
				receivers={[QuickConnectService.Instance.QuickConnectEnabled]}
				whenNotStarted={<></>} whenLoading={<></>} whenError={() => <></>}
				whenReceived={(quickConnectEnabled) => <>{quickConnectEnabled && <Layout direction="column" className={background.panel}><SignInWithQuickConnect /></Layout>}</>}
			/>
		</Layout>
	);
};
