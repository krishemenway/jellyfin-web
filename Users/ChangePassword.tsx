import * as React from "react";
import { EditableField } from "Common/EditableField";
import { TextField } from "Common/TextField";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { Receiver } from "Common/Receiver";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";
import { ServerService } from "Servers/ServerService";

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
			userId: ServerService.Instance.CurrentUserId,
		});
	}

	public Current: EditableField;
	public New: EditableField;
	public Confirm: EditableField;

	public ChangePasswordResult: Receiver<boolean>;

	static get Instance(): ChangePasswordService {
		return this._instance ?? (this._instance = new ChangePasswordService());
	}

	private static _instance: ChangePasswordService;
}

export const ChangePassword: React.FC = () => {
	return (
		<Form direction="column" onSubmit={(() => ChangePasswordService.Instance.ChangePassword())}>
			<TextField field={ChangePasswordService.Instance.Current} />
			<TextField field={ChangePasswordService.Instance.New} />
			<TextField field={ChangePasswordService.Instance.Confirm} />
			<Button label="SavePassword" type="submit" />
		</Form>
	);
};
