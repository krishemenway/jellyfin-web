import * as React from "react";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { NavigateFunction, useParams } from "react-router-dom";
import { Observable } from "@residualeffect/reactor";
import { FieldError } from "Common/FieldError";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { PageIsLoading, PageWithNavigation } from "PageWithNavigation";
import { PeopleIcon } from "People/PeopleIcon";
import { ServerService } from "Servers/ServerService";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { HyperLink } from "Common/HyperLink";
import { useBackgroundStyles } from "AppStyles";
import { Receiver } from "Common/Receiver";
import { useNavigate } from "node_modules/react-router-dom/dist";
import { Loading, useIsBusy } from "Common/Loading";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { EditableUser } from "Users/EditableUser";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";

class ManageUserService {
	constructor() {
		this.EditableUser = new Receiver<EditableUser>("UnknownError");
		this.ShowErrors = new Observable(false);
		this.SaveUserResponse = new Receiver("UnknownError");
	}

	public LoadWithAbort(userId: string): () => void  {
		this.EditableUser.Start((a) => getUserApi(ServerService.Instance.CurrentApi).getUserById({ userId: userId }, { signal: a.signal }).then(r => new EditableUser(r.data)));
		return () => this.EditableUser.ResetIfLoading();
	}

	public Save(navigate: NavigateFunction): void {
		this.ShowErrors.Value = true;
		const user = this.EditableUser.Data.Value.ReceivedData!;

		if (user.CanMakeRequest.Value) {
			this.SaveUserResponse.Start((a) => getUserApi(ServerService.Instance.CurrentApi)
				.updateUser({ userDto: user.CreateRequest(), userId: user.From.Id! }, { signal: a.signal })
				.then(() => { navigate(`/Dashboard`); }));
		}
	}

	public EditableUser: Receiver<EditableUser>;
	public ShowErrors: Observable<boolean>;
	public SaveUserResponse: Receiver<void>;

	static get Instance(): ManageUserService {
		return this._instance ?? (this._instance = new ManageUserService());
	}

	private static _instance: ManageUserService;
}

export const ManageUser: React.FC = () => {
	const userId = useParams<{ userId: string; }>().userId!;
	const navigate = useNavigate();
	const background = useBackgroundStyles();
	const showErrors = useObservable(ManageUserService.Instance.ShowErrors);
	const isBusy = useIsBusy(ManageUserService.Instance.SaveUserResponse);

	React.useEffect(() => ManageUserService.Instance.LoadWithAbort(userId), [userId]);

	return (
		<PageWithNavigation icon={<PeopleIcon />} content={() => (
			<Loading
				receivers={[ManageUserService.Instance.EditableUser]}
				whenNotStarted={<PageIsLoading />} whenLoading={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(editableUser) => (
					<Form onSubmit={() => ManageUserService.Instance.Save(navigate)} direction="column" bt br bb bl backgroundColor="Panel" gap="1rem" px="1rem" py=".5rem" my="1rem">
						<TranslatedText textKey="ButtonAddUser" elementType="h1" layout={{ fontSizeREM: 1.2 }} />

						<Layout direction="column" gap=".5rem">
							<FieldLabel field={editableUser.Name} textKey="LabelUsername" />
							<TextField field={editableUser.Name} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" />
							<FieldError field={editableUser.Name} showErrors={showErrors} />
						</Layout>

						<Layout direction="column" gap=".5rem">
							<Layout direction="row" gap=".5rem" alignItems="center">
								<ToggleSwitch field={editableUser.EnableRemoteAccess} px=".25em" py=".25em" />
								<FieldLabel field={editableUser.EnableRemoteAccess} textKey="AllowRemoteAccess" />
							</Layout>

							<FieldError field={editableUser.EnableRemoteAccess} showErrors={showErrors} />
						</Layout>

						<Layout direction="column" gap=".5rem">
							<Layout direction="row" gap=".5rem" alignItems="center">
								<ToggleSwitch field={editableUser.IsAdministrator} px=".25em" py=".25em" />
								<FieldLabel field={editableUser.IsAdministrator} textKey="OptionAllowUserToManageServer" />
							</Layout>

							<FieldError field={editableUser.IsAdministrator} showErrors={showErrors} />
						</Layout>

						<Layout direction="column" gap=".5rem">
							<Layout direction="row" gap=".5rem" alignItems="center">
								<ToggleSwitch field={editableUser.EnableCollectionManagement} px=".25em" py=".25em" />
								<FieldLabel field={editableUser.EnableCollectionManagement} textKey="AllowCollectionManagement" />
							</Layout>

							<FieldError field={editableUser.EnableCollectionManagement} showErrors={showErrors} />
						</Layout>

						<Layout direction="column" gap=".5rem">
							<Layout direction="row" gap=".5rem" alignItems="center">
								<ToggleSwitch field={editableUser.EnableSubtitleManagement} px=".25em" py=".25em" />
								<FieldLabel field={editableUser.EnableSubtitleManagement} textKey="AllowSubtitleManagement" />
							</Layout>

							<FieldError field={editableUser.EnableSubtitleManagement} showErrors={showErrors} />
						</Layout>

						<Layout direction="row" gap=".5rem" justifyContent="end">
							<HyperLink to="/Dashboard" direction="row" label="ButtonCancel" classes={[background.button]} px=".25em" py=".25em" onClick={() => editableUser.Reset()} />
							<Button type="submit" label="Save" px=".25em" py=".25em" disabled={isBusy} hiddenLabel={isBusy} icon={isBusy ? <LoadingIcon /> : <></>} />
						</Layout>
					</Form>
				)}
			/>
		)} />
	);
};
