import { QuickConnectResult } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { LoginService } from "./LoginService";
import { getUserApi, getQuickConnectApi } from "@jellyfin/sdk/lib/utils/api";

export class QuickConnectService {
	constructor() {
		this.QuickConnectCode = new EditableField("LabelQuickConnectCode", "", (current) => !Nullable.StringHasValue(current) ? "ValueIsRequiredMessage" : undefined);
		this.AuthorizeResult = new Receiver("UnknownError");
		this.ShowErrors = new Observable(false);
		this.QuickConnectResult = new Receiver("UnknownError");
		this.QuickConnectEnabled = new Receiver("UnknownError");
		this.QuickConnectPollingIntervalId = 0;
	}

	public LoadQuickConnectEnabled(): () => void {
		if (this.QuickConnectEnabled.HasData.Value) {
			return () => { };
		}

		this.QuickConnectEnabled.Start((a) => getQuickConnectApi(ServerService.Instance.CurrentApi).getQuickConnectEnabled({ signal: a.signal }).then(r => r.data));
		return () => this.QuickConnectEnabled.ResetIfLoading();
	}

	public AuthorizeQuickConnect(): void {
		this.ShowErrors.Value = true;

		if (!this.QuickConnectCode.CanMakeRequest()) {
			return;
		}

		this.AuthorizeResult.Start((a) => getQuickConnectApi(ServerService.Instance.CurrentApi).authorizeQuickConnect({ code: this.QuickConnectCode.Current.Value.trim(), userId: ServerService.Instance.CurrentUserId.Value }, { signal: a.signal }).then((r) => r.data ?? false).catch((error) => {
			if (error.response.status === 404) {
				this.QuickConnectCode.ServerErrorMessage.Value = "QuickConnectAuthorizeFail";
				return false;
			}

			return false;
		}));
	}

	public ResetFormOnClosed(): () => void {
		return () => {
			this.AuthorizeResult.Reset();
			this.QuickConnectCode.Revert();
			this.ShowErrors.Value = false;
		};
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
		this.QuickConnectResult.Reset();
		this.StopQuickConnectPolling();
	}

	private StartQuickConnectPolling(secret: string): void {
		this.StopQuickConnectPolling();

		this.QuickConnectPollingIntervalId = window.setInterval(() => {
			this.QuickConnectResult.Start(async (abort): Promise<QuickConnectResult> => {
				const result = (await getQuickConnectApi(ServerService.Instance.CurrentApi).getQuickConnectState({ secret: secret }, { signal: abort.signal })).data;

				if (result.Authenticated === true) {
					this.StopQuickConnectPolling();

					LoginService.Instance.AuthenticationResponse.Start(async (abort) => {
						return (await getUserApi(ServerService.Instance.CurrentApi).authenticateWithQuickConnect({ quickConnectDto: { Secret: secret }}, { signal: abort.signal })).data;
					});
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

	public QuickConnectCode: EditableField;
	public AuthorizeResult: Receiver<boolean>;
	public ShowErrors: Observable<boolean>;
	public QuickConnectResult: Receiver<QuickConnectResult>;
	public QuickConnectEnabled: Receiver<boolean>;

	private QuickConnectPollingIntervalId: number;

	static get Instance(): QuickConnectService {
		return this._instance ?? (this._instance = new QuickConnectService());
	}

	private static _instance: QuickConnectService;
}
