import * as React from "react";
import { VirtualFolderInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { useBackgroundStyles } from "AppStyles";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { getLibraryStructureApi } from "@jellyfin/sdk/lib/utils/api";
import { ListOf } from "Common/ListOf";

class ServerLibrariesService {
	constructor() {
		this.Libraries = new Receiver("UnknownError");
	}

	public LoadLibraries(): void {
		this.Libraries.Start((a) => getLibraryStructureApi(ServerService.Instance.CurrentApi).getVirtualFolders({ signal: a.signal }).then((r) => r.data));
	}

	public Libraries: Receiver<VirtualFolderInfo[]>;

	static get Instance(): ServerLibrariesService {
		return this._instance ?? (this._instance = new ServerLibrariesService());
	}

	private static _instance: ServerLibrariesService;
}

export const ServerLibraries: React.FC = () => {
	const background = useBackgroundStyles();

	React.useEffect(() => { ServerLibrariesService.Instance.LoadLibraries(); }, []);

	return (
		<Loading
			receivers={[ServerLibrariesService.Instance.Libraries]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="3rem" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="3rem" />}
			whenReceived={(libraries) => (
				<ListOf
					direction="column" gap="1rem"
					items={libraries}
					forEachItem={(library) => (
						<Layout key={library.ItemId} gap=".25em" direction="column" className={background.panel}>
							{library.Name}
						</Layout>
					)}
				/>
			)}
		/>
	);
};
