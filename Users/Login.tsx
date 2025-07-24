import * as React from "react";
import { Button } from "Common/Button";
import { Checkbox } from "Common/Checkbox";
import { TranslatedText } from "Common/TranslatedText";
import { TextField } from "Common/TextField";
import { useBackgroundStyles } from "Common/AppStyles";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { LoginService } from "Users/LoginService";
import { JellyfinIcon } from "Common/JellyfinIcon";
import { CenteredModal } from "Common/Modal";
import { useObservable } from "@residualeffect/rereactor";
import { FieldLabel } from "Common/FieldLabel";
import { Form } from "Common/Form";
import { Nullable } from "Common/MissingJavascriptFunctions";

const SignInWithQuickConnect: React.FC = () => {
	React.useEffect(() => { return () => LoginService.Instance.Dispose(); }, []);

	return (
		<Layout direction="column" gap={16} px={16} py={16}>
			<Layout direction="row"><TranslatedText textKey="QuickConnect" /></Layout>

			<Loading
				receivers={[LoginService.Instance.QuickConnectResult]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenNotStarted={<StartQuickConnect />}
				whenLoading={<LoadingIcon size={48} />}
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
			<Button direction="row" type="button" px={8} py={4} onClick={() => LoginService.Instance.FindQuickConnectTokenAndBeginWaitingForAuthentication()} label="LabelQuickConnectCode" />
		</Layout>
	);
}

const SignInWithCredentials: React.FC = () => {
	const background = useBackgroundStyles();
	const showForgotPassword = useObservable(LoginService.Instance.ShowForgotPassword);

	return (
		<>
			<Form onSubmit={() => LoginService.Instance.SignInWithCredentials()} direction="column" gap={16} px={16} py={16}>
				<Layout direction="column" gap={8}>
					<FieldLabel field={LoginService.Instance.UserName} />
					<TextField field={LoginService.Instance.UserName} />
				</Layout>

				<Layout direction="column" gap={8}>
					<FieldLabel field={LoginService.Instance.Password} />
					<TextField field={LoginService.Instance.Password} />
				</Layout>

				<Layout direction="row" gap={8} alignItems="center">
					<Checkbox field={LoginService.Instance.RememberMe} />
					<FieldLabel field={LoginService.Instance.RememberMe} />
				</Layout>

				<Button direction="row" label="ButtonSignIn" type="submit" justifyContent="center" px={8} py={4} />
				<Button direction="row" label="ButtonForgotPassword" type="button" justifyContent="center" px={8} py={4} onClick={() => { LoginService.Instance.ShowForgotPassword.Value = true; }} />
			</Form>

			<CenteredModal open={showForgotPassword} onClosed={() => { LoginService.Instance.ShowForgotPassword.Value = false; }}>
				<Form onSubmit={() => LoginService.Instance.SubmitForgotPassword()} direction="column" className={background.alternatePanel} gap={32} px={16} py={16}>
					<Layout direction="row"><TranslatedText textKey="ButtonForgotPassword" /></Layout>

					<Layout direction="column" gap={8}>
						<TextField field={LoginService.Instance.UserName} />
						<Layout direction="row"><TranslatedText textKey="LabelForgotPasswordUsernameHelp"></TranslatedText></Layout>
					</Layout>

					<Layout direction="column" gap={8}>
						<Button direction="row" type="submit" label="ButtonSubmit" px={8} py={4} />
						<Button direction="row" type="button" label="ButtonCancel" px={8} py={4} onClick={() => { LoginService.Instance.ShowForgotPassword.Value = false; }} />
					</Layout>
				</Form>
			</CenteredModal>
		</>
	);
};

export const Login: React.FC = () => {
	const background = useBackgroundStyles();

	return (
		<Layout direction="column" gap={16} alignItems="center" my={32}>
			<JellyfinIcon size="100" />
			<Layout direction="column" className={background.panel}><SignInWithCredentials /></Layout>
			<Layout direction="column" className={background.panel}><SignInWithQuickConnect /></Layout>
		</Layout>
	);
};
