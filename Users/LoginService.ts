import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { AuthenticationResult, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { Observable } from "@residualeffect/reactor";
import { QuickConnectService } from "./QuickConnect";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class LoginService {
	constructor() {
		this.UserName = new EditableField("LabelUser", "");
		this.Password = new EditableField("LabelPassword", "");

		this.RememberMe = new EditableField("RememberMe", "false");

		this.ShowForgotPassword = new Observable(false);

		this.User = new Receiver("UnknownError");
		this.AuthenticationResponse = new Receiver("UnknownError");

		this.AuthenticationResponse.OnReceived.push((response) => {
			if (!response.User?.Id) {
				throw new Error("Missing User Id");
			}

			if (!response.AccessToken) {
				throw new Error("Missing access token");
			}

			this.Dispose();
			ServerService.Instance.SetAccessTokenForServer(response.AccessToken, response.User.Id);
		});
	}

	public LoadUser(): () => void {
		if (ServerService.Instance.Servers.length === 0 || !Nullable.StringHasValue(ServerService.Instance.CurrentUserId.Value)) {
			return () => { };
		}

		this.User.Start(async (a) => {
			const result = await getUserApi(ServerService.Instance.CurrentApi).getCurrentUser({ signal: a.signal })
			return result.data;
		});

		return () => this.User.ResetIfLoading();
	}

	public SubmitForgotPassword(): void {
		console.error("forgot password not implemented");
	}

	public SignOut(): void {
		ServerService.Instance.SetAccessTokenForServer(null, null);
	}

	public SignInWithCredentials(): void {
		this.AuthenticationResponse.Start(() => {
			const userName = this.UserName.Current.Value;
			const password = this.Password.Current.Value;

			return ServerService.Instance.CurrentApi.authenticateUserByName(userName, password).then((r) => r.data);
		});
	}

	public Dispose(): void {
		this.AllFields.forEach((f) => f.Revert());
		this.AuthenticationResponse.Reset();
		QuickConnectService.Instance.Dispose();
		
	}

	private get AllFields(): EditableField[] {
		return [
			this.UserName,
			this.Password,
			this.RememberMe,
		];
	}

	public UserName: EditableField;
	public Password: EditableField;
	public RememberMe: EditableField;

	public ShowForgotPassword: Observable<boolean>;

	public AuthenticationResponse: Receiver<AuthenticationResult>;

	public User: Receiver<UserDto>;

	static get Instance(): LoginService {
		return this._instance ?? (this._instance = new LoginService());
	}

	private static _instance: LoginService;
}
