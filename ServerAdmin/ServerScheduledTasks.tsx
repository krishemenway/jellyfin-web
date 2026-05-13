import * as React from "react";
import { ListOf } from "Common/ListOf";
import { useBackgroundStyles } from "AppStyles";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { Receiver } from "Common/Receiver";
import { TaskInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { ServerService } from "Servers/ServerService";
import { getScheduledTasksApi } from "@jellyfin/sdk/lib/utils/api";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { Button } from "Common/Button";
import { PlayIcon } from "MediaPlayer/PlayIcon";
import { TranslatedText } from "Common/TranslatedText";
import { formatDuration, intervalToDuration, parseISO } from "date-fns";

class ScheduledTasksService {
	constructor() {
		this.ScheduledTasks = new Receiver("UnknownError");
		this.ExecuteTask = new Receiver("UnknownError");
	}

	public LoadTasks(): () => void {
		this.ScheduledTasks.Start((a) => getScheduledTasksApi(ServerService.Instance.CurrentApi).getTasks({ isHidden: false }, { signal: a.signal }).then(r => Linq.GroupBy(r.data, (t) => t.Category!)));
		return () => this.ScheduledTasks.ResetIfLoading();
	}

	public RunTask(task: TaskInfo): void {
		this.ExecuteTask.Start(a => getScheduledTasksApi(ServerService.Instance.CurrentApi).startTask({ taskId: task.Id! }, { signal: a.signal }).then(r => r.data));
	}

	public ScheduledTasks: Receiver<Record<string, TaskInfo[]>>;
	public ExecuteTask: Receiver<any>;

	static get Instance(): ScheduledTasksService {
		return this._instance ?? (this._instance = new ScheduledTasksService());
	}

	private static _instance: ScheduledTasksService;
}

export const ServerScheduledTasks: React.FC = () => {
	const background = useBackgroundStyles();

	React.useEffect(() => ScheduledTasksService.Instance.LoadTasks(), []);

	return (
		<Loading
			receivers={[ScheduledTasksService.Instance.ScheduledTasks]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
			whenReceived={(tasks) => (
				<ListOf
					className={background.panel}
					items={Object.keys(tasks)}
					direction="column" gap="1rem" py=".5rem" px=".5rem"
					forEachItem={(category) => (
						<Layout direction="column" gap=".75em" px=".5rem" key={category}>
							<Layout direction="row" alignItems="center" justifyContent="center" fontSize="1.1em">{category}</Layout>

							<ListOf
								direction="column" gap=".25rem"
								items={tasks[category]}
								forEachItem={(task) => <ServerTask task={task} key={task.Id} />}
							/>
						</Layout>
					)}
				/>
			)}
		/>
	);
};

export const ServerTask: React.FC<{ task: TaskInfo }> = ({ task }) => {
	const startTime = React.useMemo(() => Nullable.Value(task.LastExecutionResult?.StartTimeUtc, undefined, (startTime) => parseISO(startTime)), [task]);
	const endTime = React.useMemo(() => Nullable.Value(task.LastExecutionResult?.EndTimeUtc, undefined, (endTime) => parseISO(endTime)), [task]);
	const duration =  React.useMemo(() => Nullable.HasValue(startTime) && Nullable.HasValue(endTime) ? formatDuration(intervalToDuration({ start: startTime, end: endTime })) : undefined, [startTime, endTime]);

	return (
		<Layout direction="row" justifyContent="space-between">
			<Layout direction="column">
				<Layout direction="row">{task.Name}</Layout>

				{Nullable.HasValue(endTime) && Nullable.HasValue(duration) && (
					<TranslatedText textKey="LabelScheduledTaskLastRan" textProps={[`${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}`, duration]} elementType="div" />
				)}
			</Layout>

			<Button type="button" onClick={() => ScheduledTasksService.Instance.RunTask(task)} icon={<PlayIcon />} px=".25em" py=".25em" alignItems="center" justifyContent="center" />
		</Layout>
	);
};
