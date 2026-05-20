import * as React from "react";
import { ListOf } from "Common/ListOf";
import { useBackgroundStyles } from "AppStyles";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { Receiver } from "Common/Receiver";
import { DeviceInfoDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ServerService } from "Servers/ServerService";
import { getDevicesApi } from "@jellyfin/sdk/lib/utils/api";
import { TranslatedText } from "Common/TranslatedText";
import { formatDate } from "date-fns/format";
import { Nullable } from "Common/MissingJavascriptFunctions";

class ServerDevicesService {
	constructor() {
		this.Devices = new Receiver("UnknownError");
	}

	public LoadDevices(): () => void {
		this.Devices.Start((a) => getDevicesApi(ServerService.Instance.CurrentApi).getDevices({}, { signal: a.signal }).then((response) => response.data.Items ?? []));
		return () => this.Devices.ResetIfLoading();
	}

	public Devices: Receiver<DeviceInfoDto[]>;

	static get Instance(): ServerDevicesService {
		return this._instance ?? (this._instance = new ServerDevicesService());
	}

	private static _instance: ServerDevicesService;
}

export const ServerDevices: React.FC = () => {
	const background = useBackgroundStyles();

	React.useEffect(() => ServerDevicesService.Instance.LoadDevices(), []);

	return (
		<Loading
			receivers={[ServerDevicesService.Instance.Devices]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
			whenReceived={(devices) => (
				<Layout direction="column" className={background.panel} gap="1rem" py="1rem" px="1rem">
					<Layout direction="row" fontSizeREM={1.1}><TranslatedText textKey="HeaderDevices" /></Layout>
					<ListOf
						direction="column" gap="1em"
						items={devices}
						forEachItem={(device) => (
							<Layout key={`${device.Id}-${device.DateLastActivity}`} gap=".25em" direction="column">
								<Layout direction="row">{device.LastUserName} — {device.Name}</Layout>
								<Layout direction="row" fontSizeREM={.9} fontColor="Secondary">{Nullable.StringValue(device.DateLastActivity, "—", (date) => formatDate(date, "PPP pp"))}</Layout>
							</Layout>
						)}
					/>
				</Layout>
			)}
		/>
	);
};
