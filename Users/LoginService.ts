import { getQuickConnectApi, getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { AuthenticationResult, QuickConnectResult } from "@jellyfin/sdk/lib/generated-client/models";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { Observable } from "@residualeffect/reactor";

export class LoginService {
	constructor() {
		this.UserName = new EditableField("LabelUser", "");
		this.Password = new EditableField("LabelPassword", "");

		this.RememberMe = new EditableField("RememberMe", "false");

		this.ShowForgotPassword = new Observable(false);

		this.AuthenticationResponse = new Receiver("Failed");
		this.QuickConnectResult = new Receiver("Failed to get quick connect token.");

		this.QuickConnectPollingIntervalId = 0;
	}

	public SubmitForgotPassword(): void {
		console.error("forgot password not implemented");
	}

	public SignOut(): void {
		ServerService.Instance.SetAccessTokenForServer(null, null);
	}

	public SignInWithCredentials(): void {
		this.AuthenticationResponse.Start(async () => {
			const userName = this.UserName.Current.Value;
			const password = this.Password.Current.Value;

			return ServerService.Instance.CurrentApi.authenticateUserByName(userName, password).then((r) => r.data);
		});
	}

	public FindQuickConnectTokenAndBeginWaitingForAuthentication(): void {
		this.QuickConnectResult.Start(async (abort): Promise<QuickConnectResult> => {
			const response = await getQuickConnectApi(ServerService.Instance.CurrentApi).initiateQuickConnect({ signal: abort.signal, headers: { Authorization: ServerService.Instance.CurrentApi.authorizationHeader }});

			if (response.data.Secret !== undefined) {
				this.StartQuickConnectPolling(response.data.Secret);
			}

			return response.data;
		});
	}

	public Dispose(): void {
		this.StopQuickConnectPolling();
	}

	private StartQuickConnectPolling(secret: string): void {
		this.QuickConnectPollingIntervalId = window.setInterval(() => {
			this.QuickConnectResult.Start(async (abort): Promise<QuickConnectResult> => {
				const result = (await getQuickConnectApi(ServerService.Instance.CurrentApi).getQuickConnectState({ secret: secret }, { signal: abort.signal })).data;

				if (result.Authenticated === true) {
					this.WhenAuthenticated(secret);
				}

				return result;
			}, true);
		}, 5000);
	}

	private StopQuickConnectPolling() {
		if (this.QuickConnectPollingIntervalId !== 0) {
			window.clearInterval(this.QuickConnectPollingIntervalId);
		}
	}

	private WhenAuthenticated(secret: string): void {
		this.StopQuickConnectPolling();
		this.AuthenticationResponse.Start(async (abort) => {
			const response = (await getUserApi(ServerService.Instance.CurrentApi).authenticateWithQuickConnect({ quickConnectDto: { Secret: secret }}, { signal: abort.signal })).data;

			if (!response.User?.Id) {
				throw new Error("Missing User Id");
			}

			if (!response.AccessToken) {
				throw new Error("Missing access token");
			}

			ServerService.Instance.SetAccessTokenForServer(response.AccessToken, response.User.Id);
			return response;
		});
	}

	public UserName: EditableField;
	public Password: EditableField;
	public RememberMe: EditableField;

	public ShowForgotPassword: Observable<boolean>;

	public QuickConnectResult: Receiver<QuickConnectResult>;
	public AuthenticationResponse: Receiver<AuthenticationResult>;

	private QuickConnectPollingIntervalId: number;

	static get Instance(): LoginService {
		return this._instance ?? (this._instance = new LoginService());
	}

	private static _instance: LoginService;
}
