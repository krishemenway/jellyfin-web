import { Api, Jellyfin } from "@jellyfin/sdk";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Receiver } from "Common/Receiver";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SystemInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { DeviceService } from "Device/DeviceService";

interface JellyfinCredentials {
	Servers: ServerConnection[]
}

export interface ServerConnection {
	Id: string;
	Name: string;

	ManualAddress: string;
	LocalAddress: string;
	LastConnectionMode: ConnectionMode;
	DateLastAccessed: number;
	Version: string;

	AccessToken: string|null;
	UserId: string|null;
	ExchangeToken: string|null;
}

enum ConnectionMode {
	Local = 0,
	Remote = 1,
	Manual = 2,
}

export class ServerService {
	constructor() {
		this.Servers = new ObservableArray(this.LoadServersFromLocalStorage());
		this.CurrentServer = new Observable(this.Servers.Value[0] ?? null);
		this.TryAddServerHost = new EditableField("LabelServerHost", "", (current) => !Nullable.StringHasValue(current) ? "ValueIsRequiredMessage" : undefined);
		this.TryAddServerResult = new Receiver("UnknownError");
		this.TryAddServerErrorMessagesShown = new Observable(false);
		this.ServerInfo = new Receiver("UnknownError");
		this.CurrentUserId = new Computed(() => this.CurrentServer.Value?.UserId ?? "");
		this._apis = {};
	}

	public get CurrentApi(): Api {
		if (!Nullable.HasValue(this.CurrentServer.Value)) {
			throw new Error("Missing Api");
		}

		return Nullable.HasValue(this._apis[this.CurrentServer.Value.Id])
			? this._apis[this.CurrentServer.Value.Id]
			: this.ResetApiForCurrentServer(this.CurrentServer.Value);
	}

	public Remove(server: ServerConnection): void {
		this.Servers.remove(server);
		this.SetServersToLocalStorage();
	}

	public TryAddServer(onSuccess: () => void): void {
		this.TryAddServerErrorMessagesShown.Value = true;

		if (!this.TryAddServerHost.CanMakeRequest()) {
			return;
		}

		this.TryAddServerResult.Start(async (abort) => this.CheckSystemInfoForHost(this.TryAddServerHost.Current.Value, onSuccess, abort));
	}

	public ResetTryAddServer(): () => void {
		this.TryAddServerResult.Reset();
		this.TryAddServerHost.Revert();
		this.TryAddServerErrorMessagesShown.Value = false;

		return () => {
			this.TryAddServerResult.Reset();
			this.TryAddServerHost.Revert();
			this.TryAddServerErrorMessagesShown.Value = false;
		};
	}

	public SelectServerConnection(connection: ServerConnection): void {
		this.CurrentServer.Value = connection;
		this.SetServersToLocalStorage();
		this.ResetApiForCurrentServer(connection);

		this.ServerInfo.Reset();
		this.LoadServerInfoWithAbort();
	}

	public SetAccessTokenForServer(accessToken: string|null, userId: string|null): void {
		const connection = this.CurrentServer.Value;

		if (connection === null) {
			throw new Error("Connect not available for token");
		}

		connection.AccessToken = accessToken;
		connection.UserId = userId;
		connection.DateLastAccessed = new Date().getTime();

		this.SelectServerConnection(connection);
	}

	public AttemptSetupOfCurrentDomainAsServer(): void {
		if (this.Servers.length === 0) {
			this.CheckSystemInfoForHost(window.location.origin);
		}
	}

	public LoadServerInfoWithAbort(): () => void {
		if (this.ServerInfo.HasData.Value) {
			return () => { };
		}

		this.ServerInfo.Start((a) => getSystemApi(this.CurrentApi).getSystemInfo({ signal: a.signal }).then((response) => response.data));
		return () => this.ServerInfo.ResetIfLoading();
	}

	private CheckSystemInfoForHost(host: string, onSuccess?: () => void, abort?: AbortController): Promise<boolean> {
		const hostWithProtocol = this.EnsureProtocolForHost(host);
		return getSystemApi(this.CreateJellyfin().createApi(hostWithProtocol)).getPublicSystemInfo({ signal: abort?.signal })
			.then((response) => {
				if (Nullable.HasValue(response.data.Id)) {
					const connection: ServerConnection = {
						Id: response.data.Id,
						Name: response.data.ServerName!,
						DateLastAccessed: new Date().getTime(),
						ManualAddress: hostWithProtocol,
						LastConnectionMode: ConnectionMode.Manual,
						LocalAddress: response.data.LocalAddress!,
						Version: response.data.Version!,
						AccessToken: null,
						ExchangeToken: null,
						UserId: null,
					};

					this.Servers.unshift(connection);
					this.CurrentServer.Value = connection;
					this.SetServersToLocalStorage();
					this.ResetApiForCurrentServer(connection);
					this.TryAddServerErrorMessagesShown.Value = false;
					Nullable.TryExecute(onSuccess, (f) => f());
					return true;
				} else {
					throw new Error("UnknownError");
				}
			});
	}

	private ResetApiForCurrentServer(server: ServerConnection): Api {
		return this._apis[server.Id] = this.CreateJellyfin().createApi(server.ManualAddress, server.AccessToken ?? undefined);
	}

	private SetServersToLocalStorage(): void {
		window.localStorage.setItem("jellyfin_credentials", JSON.stringify({ Servers: this.Servers.Value }));
	}

	private CreateJellyfin(): Jellyfin {
		return new Jellyfin({
			clientInfo: { name: 'Jellyfin Web Upgrayed', version: '0.0.1', },
			deviceInfo: { name: DeviceService.Instance.DeviceName, id: DeviceService.Instance.DeviceId },
		});
	}

	private LoadServersFromLocalStorage(): ServerConnection[] {
		const credentials = window.localStorage.getItem("jellyfin_credentials");

		if (credentials === null || credentials.length < 3) {
			return [];
		}

		return (JSON.parse(credentials) as JellyfinCredentials).Servers ?? [];
	}

	private EnsureProtocolForHost(host: string): string {
		if (host.startsWith("http://")) {
			return host;
		}

		if (host.startsWith("https://")) {
			return host;
		}

		return `http://${host}`;
	}

	public Servers: ObservableArray<ServerConnection>;
	public CurrentServer: Observable<ServerConnection|null>;
	public ServerInfo: Receiver<SystemInfo>;
	public CurrentUserId: Computed<string>;

	public TryAddServerHost: EditableField<string>;
	public TryAddServerResult: Receiver<boolean>;
	public TryAddServerErrorMessagesShown: Observable<boolean>;

	private _apis: Record<string, Api>;

	static get Instance(): ServerService {
		return this._instance ?? (this._instance = new ServerService());
	}

	private static _instance: ServerService;
}
