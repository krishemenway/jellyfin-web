import * as React from "react";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { NavigateFunction } from "react-router-dom";
import { Observable } from "@residualeffect/reactor";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { FieldError } from "Common/FieldError";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";
import { TextField } from "Common/TextField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { PageWithNavigation } from "PageWithNavigation";
import { PeopleIcon } from "People/PeopleIcon";
import { ServerService } from "Servers/ServerService";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { HyperLink } from "Common/HyperLink";
import { useBackgroundStyles } from "AppStyles";
import { Receiver } from "Common/Receiver";
import { useNavigate } from "node_modules/react-router-dom/dist";
import { useIsBusy } from "Common/Loading";
import { LoadingIcon } from "CommonIcons/LoadingIcon";

class CreateUserService {
	constructor() {
		this.UserName = new EditableField<string>("UserName", "", ValueIsRequired);
		this.Password = new EditableField<string>("Password", "", ValueIsRequired);
		this.ShowErrors = new Observable(false);
		this.CreateUserResponse = new Receiver("UnknownError");
	}

	public Reset(): void {
		this.AllFields().forEach((f) => f.Revert());
	}

	public Save(navigate: NavigateFunction): void {
		this.ShowErrors.Value = true;

		if (this.AllFields().every((field) => field.CanMakeRequest())) {
			const user = this.UserName.Current.Value;
			const pass = this.Password.Current.Value;

			this.CreateUserResponse.Start((a) => getUserApi(ServerService.Instance.CurrentApi)
				.createUserByName({ createUserByName: { Name: user, Password: pass }}, { signal: a.signal })
				.then((r) => { this.Reset(); navigate(`/ManageUser/${r.data.Id}`); }));
		}
	}

	public UserName: EditableField<string>;
	public Password: EditableField<string>;
	public ShowErrors: Observable<boolean>;

	public CreateUserResponse: Receiver<void>;

	public AllFields(): IEditableField[] {
		return [
			this.UserName,
			this.Password,
		];
	}

	static get Instance(): CreateUserService {
		return this._instance ?? (this._instance = new CreateUserService());
	}

	private static _instance: CreateUserService;
}

export const CreateUser: React.FC = () => {
	const navigate = useNavigate();
	const background = useBackgroundStyles();
	const showErrors = useObservable(CreateUserService.Instance.ShowErrors);
	const isBusy = useIsBusy(CreateUserService.Instance.CreateUserResponse);

	return (
		<PageWithNavigation icon={<PeopleIcon />} content={() => (
			<Form onSubmit={() => CreateUserService.Instance.Save(navigate)} direction="column" bt br bb bl backgroundColor="Panel" gap="1rem" px="1rem" py=".5rem" my="1rem">
				<TranslatedText textKey="ButtonAddUser" elementType="h1" layout={{ fontSizeREM: 1.2 }} />

				<Layout direction="column" gap=".5rem">
					<FieldLabel field={CreateUserService.Instance.UserName} textKey="LabelUsername" />
					<TextField field={CreateUserService.Instance.UserName} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" />
					<FieldError field={CreateUserService.Instance.UserName} showErrors={showErrors} />
				</Layout>

				<Layout direction="column" gap=".5rem">
					<FieldLabel field={CreateUserService.Instance.Password} textKey="LabelPassword" />
					<TextField field={CreateUserService.Instance.Password} password bt br bb bl backgroundColor="Field" px=".25em" py=".25em" />
					<FieldError field={CreateUserService.Instance.Password} showErrors={showErrors} />
				</Layout>

				<Layout direction="row" gap=".5rem" justifyContent="end">
					<HyperLink to="/Dashboard" direction="row" label="ButtonCancel" classes={[background.button]} px=".25em" py=".25em" onClick={() => CreateUserService.Instance.Reset()} />
					<Button type="submit" label="ButtonAddUser" px=".25em" py=".25em" disabled={isBusy} hiddenLabel={isBusy} icon={isBusy ? <LoadingIcon /> : <></>} />
				</Layout>
			</Form>
		)} />
	);
};
