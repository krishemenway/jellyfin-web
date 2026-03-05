import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { ProgressBar } from "Common/ProgressBar";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { EditIcon } from "CommonIcons/EditIcon";
import { Receiver } from "Common/Receiver";
import { SystemStorageDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { ServerService } from "Servers/ServerService";
import { GeneralSettingsService } from "ServerAdmin/GeneralSettingsService";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";

class ServerPathsService {
	constructor() {
		this.Storage = new Receiver("UnknownError");
	}

	public LoadServerPaths(): void {
		this.Storage.Start((a) => getSystemApi(ServerService.Instance.CurrentApi).getSystemStorage({ signal: a.signal }).then((response) => response.data))
	}

	public Storage: Receiver<SystemStorageDto>;

	static get Instance(): ServerPathsService {
		return this._instance ?? (this._instance = new ServerPathsService());
	}

	private static _instance: ServerPathsService;
}

export const ServerPaths: React.FC = () => {
	const background = useBackgroundStyles();

	React.useEffect(() => { ServerPathsService.Instance.LoadServerPaths(); }, []);

	return (
		<Loading
			receivers={[ServerPathsService.Instance.Storage, LocalizationOptionsStore.Instance.LocalizationOptions]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
			whenReceived={(storage, localizationOptions) => (
				<Layout direction="column" gap="1em" className={background.panel} px="1em" py="1em">
					<Layout direction="row" justifyContent="space-between">
						<TranslatedText textKey="HeaderPaths" elementType="div" layout={{ fontSize: "1.2em" }} />
						<Button type="button" onClick={() => GeneralSettingsService.Instance.Load(localizationOptions)} direction="row"><EditIcon /></Button>
					</Layout>
					<ListOf
						direction="column" gap="1em"
						items={[
							{ name: "LabelCachePath", data: storage.CacheFolder },
							{ name: "LabelImageCachePath", data: storage.ImageCacheFolder },
							{ name: "LabelProgramData", data: storage.ProgramDataFolder },
							{ name: "LabelLogs", data: storage.LogFolder },
							{ name: "LabelMetadata", data: storage.InternalMetadataFolder },
							{ name: "LabelTranscodes", data: storage.TranscodingTempFolder },
							{ name: "LabelWeb", data: storage.WebFolder },
						]}
						forEachItem={(path) => (
							<Layout key={path?.name} gap=".25em" direction="column">
								<TranslatedText textKey={path.name} elementType="div" />
								<Layout direction="row">{path.data?.Path}</Layout>
								<ProgressBar percentage={(path.data?.UsedSpace ?? 0) / ((path.data?.UsedSpace ?? 0) + (path.data?.FreeSpace ?? 0)) * 100} height=".25em" />
							</Layout>
						)}
					/>
				</Layout>
			)}
		/>
	);
};
