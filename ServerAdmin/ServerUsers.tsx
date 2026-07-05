import * as React from "react";
import { formatDate } from "date-fns";
import { Layout } from "Common/Layout"
import { Receiver } from "Common/Receiver";
import { getUserApi } from "node_modules/@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { UserDto } from "node_modules/@jellyfin/sdk/lib/generated-client";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { DataTable } from "Common/DataTable";
import { SortByBoolean, SortByString } from "Common/ArrayPrototype";
import { CheckIcon } from "CommonIcons/CheckIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class ServerUserService {
	constructor() {
		this.Users = new Receiver("UnknownError");
	}

	public Load(): () => void {
		this.Users.Start((a) => getUserApi(ServerService.Instance.CurrentApi).getUsers({ }, { signal: a.signal }).then(r => r.data));
		return () => this.Users.ResetIfLoading();
	}

	public Users: Receiver<UserDto[]>;

	static get Instance(): ServerUserService {
		return this._instance ?? (this._instance = new ServerUserService());
	}

	private static _instance: ServerUserService;
}

export const ServerUsers: React.FC = () => {
	React.useEffect(() => ServerUserService.Instance.Load(), []);

	return (
		<Layout direction="row" backgroundColor="Panel">
			<Loading
				receivers={[ServerUserService.Instance.Users]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
				whenReceived={(users) => <LoadedServerUsers users={users} />}
			/>
		</Layout>
	);
};

const LoadedServerUsers: React.FC<{ users: UserDto[]; }> = ({ users }) => {
	return (
		<DataTable
			items={users}
			columns={[
				{ id: "ID", header: { Key: "UserId" }, content: (user) => <>{user.Id}</>, sortFunc: SortByString(user => user.Id) },
				{ id: "Name", header: { Key: "LabelName" }, content: (user) => <>{user.Name}</>, sortFunc: SortByString(user => user.Name) },
				{ id: "IsAdministrator", header: { Key: "LabelAdministrator" }, content: (user) => user.Policy?.IsAdministrator ? <CheckIcon /> : <></>, sortFunc: SortByBoolean(user => user.Policy?.IsAdministrator ?? false) },
				{ id: "LastActivity", header: { Key: "LabelLastActivity" }, content: (user) => Nullable.StringValue(user.LastActivityDate, "—", (date) => formatDate(date, "PPP pp")), sortFunc: SortByString(user => user.LastActivityDate) },
				{ id: "IsDisabled", header: { Key: "LabelDisabled" }, content: (user) => user.Policy?.IsDisabled ? <CheckIcon /> : <></>, sortFunc: SortByBoolean(user => user.Policy?.IsDisabled ?? false) },
			]}
			keyFunc={(item) => item.Id!}
			defaultSortColumn="LastActivity" defaultSortReversed
			tableHeaderButtonProps={{ px: ".25em", py: ".25em" }}
			tableDataProps={{ px: ".25em", py: ".25em" }}
			width="100%"
		/>
	);
};
