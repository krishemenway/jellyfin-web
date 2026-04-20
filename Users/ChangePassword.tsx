import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TextField } from "Common/TextField";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { Receiver } from "Common/Receiver";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { ServerService } from "Servers/ServerService";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";

class ChangePasswordService {
	constructor() {
		this.Current = new EditableField("LabelCurrentPassword", "");
		this.New = new EditableField("LabelNewPassword", "");
		this.Confirm = new EditableField("LabelNewPasswordConfirm", "");

		this.ChangePasswordResult = new Receiver("UnknownError");
	}

	public ChangePassword(): void {
		getUserApi(ServerService.Instance.CurrentApi).updateUserPassword({
			updateUserPassword: { CurrentPw: this.Current.Current.Value, NewPw: this.New.Current.Value },
			userId: ServerService.Instance.CurrentUserId.Value,
		});
	}

	public Current: EditableField<string>;
	public New: EditableField<string>;
	public Confirm: EditableField<string>;

	public ChangePasswordResult: Receiver<boolean>;

	static get Instance(): ChangePasswordService {
		return this._instance ?? (this._instance = new ChangePasswordService());
	}

	private static _instance: ChangePasswordService;
}

export const ChangePassword: React.FC = () => {
	return (
		<Form direction="column" onSubmit={(() => ChangePasswordService.Instance.ChangePassword())} gap="1rem">
			<Layout direction="column" gap=".5rem">
				<FieldLabel field={ChangePasswordService.Instance.Current} />
				<TextField field={ChangePasswordService.Instance.Current} password px=".5em" py=".25em" />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={ChangePasswordService.Instance.New} />
				<TextField field={ChangePasswordService.Instance.New} password px=".5em" py=".25em" />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={ChangePasswordService.Instance.Confirm} />
				<TextField field={ChangePasswordService.Instance.Confirm} password px=".5em" py=".25em" />
			</Layout>

			<Button label="SavePassword" type="submit" px=".5em" py=".5em" justifyContent="center" />
		</Form>
	);
};
