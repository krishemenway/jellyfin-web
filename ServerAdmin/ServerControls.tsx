import * as React from "react";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { getScheduledTasksApi, getSystemApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { Linq } from "Common/MissingJavascriptFunctions";

function shutdownServer(): void {
	getSystemApi(ServerService.Instance.CurrentApi).shutdownApplication();
}

function restartServer(): void {
	getSystemApi(ServerService.Instance.CurrentApi).shutdownApplication();
}

function scanAllLibraries(): void {
	getScheduledTasksApi(ServerService.Instance.CurrentApi).getTasks({ isHidden: false }).then((tasks) => {
		const refreshLibraryTask = Linq.First(tasks.data, t => t.Key === "RefreshLibrary");
		getScheduledTasksApi(ServerService.Instance.CurrentApi).startTask({ taskId: refreshLibraryTask.Id! });
	});
}

export const ServerControls: React.FC = () => {
	return (
		<Layout direction="column" gap="1rem">
			<Button type="button" onClick={() => { scanAllLibraries(); }} label="ButtonScanAllLibraries" px=".5em" py=".5em" justifyContent="center" />
			<Button type="button" onClick={() => { restartServer(); }} label="Restart" px=".5em" py=".5em" justifyContent="center" />
			<Button type="button" onClick={() => { shutdownServer(); }} label="ButtonShutdown" px=".5em" py=".5em" justifyContent="center" />
		</Layout>
	);
};
