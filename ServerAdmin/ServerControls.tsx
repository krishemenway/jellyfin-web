import * as React from "react";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

function shutdownServer(): void {
	getSystemApi(ServerService.Instance.CurrentApi).shutdownApplication();
}

function restartServer(): void {
	getSystemApi(ServerService.Instance.CurrentApi).shutdownApplication();
}

export const ServerControls: React.FC = () => {
	return (
		<Layout direction="column" gap="1rem">
			<Button type="button" onClick={() => { restartServer(); }} label="Restart" px=".5em" py=".5em" justifyContent="center" />
			<Button type="button" onClick={() => { shutdownServer(); }} label="ButtonShutdown" px=".5em" py=".5em" justifyContent="center" />
		</Layout>
	);
};
