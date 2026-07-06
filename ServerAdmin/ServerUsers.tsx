import * as React from "react";
import { formatDate } from "date-fns";
import { Layout } from "Common/Layout"
import { Receiver } from "Common/Receiver";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { UserDto } from "node_modules/@jellyfin/sdk/lib/generated-client";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { DataTable } from "Common/DataTable";
import { SortByBoolean, SortByString } from "Common/ArrayPrototype";
import { CheckIcon } from "CommonIcons/CheckIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";
import { HyperLink } from "Common/HyperLink";
import { EditIcon } from "CommonIcons/EditIcon";
import { AddIcon } from "CommonIcons/AddIcon";

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
		<Layout direction="column" backgroundColor="Panel" bt br bb bl gap="1rem" px="1rem">
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
		<>
			<Layout direction="row" justifyContent="space-between">
				<TranslatedText textKey="HeaderUsers" layout={{ fontSizeREM: 1.1, my: ".5rem" }} elementType="div" />
				<Layout direction="row">
					<HyperLink to="/CreateUser" direction="row" label="Add" icon={<AddIcon />} hiddenLabel alignItems="center" justifyContent="center" gap=".5em" px=".5em" />
				</Layout>
			</Layout>
			<DataTable
				items={users}
				columns={[
					{ id: "ID", header: { Key: "UserId" }, width: "5em", content: (user) => <>{user.Id}</>, sortFunc: SortByString(user => user.Id) },
					{ id: "Name", header: { Key: "LabelName" }, content: (user) => <>{user.Name}</>, sortFunc: SortByString(user => user.Name) },
					{ id: "IsAdministrator", header: { Key: "LabelAdministrator" }, content: (user) => user.Policy?.IsAdministrator ? <CheckIcon /> : <></>, sortFunc: SortByBoolean(user => user.Policy?.IsAdministrator ?? false), align: "center" },
					{ id: "LastActivity", header: { Key: "LabelLastActivity" }, content: (user) => Nullable.StringValue(user.LastActivityDate, "—", (date) => formatDate(date, "PPP pp")), sortFunc: SortByString(user => user.LastActivityDate) },
					{ id: "IsDisabled", header: { Key: "LabelDisabled" }, content: (user) => user.Policy?.IsDisabled ? <CheckIcon /> : <></>, sortFunc: SortByBoolean(user => user.Policy?.IsDisabled ?? false), align: "center" },
					{ id: "Edit", header: { Key: "Edit" }, content: (user) => <HyperLink direction="row" to={`/ManageUser/${user.Id}`} alignItems="center" justifyContent="center" py=".25em" icon={<EditIcon />} label="Edit" hiddenLabel />, align: "center" }
				]}
				keyFunc={(item) => item.Id!}
				defaultSortColumn="LastActivity" defaultSortReversed
				tableHeaderButtonProps={{ px: ".25em", py: ".25em" }}
				tableDataProps={{ px: ".25em", py: ".25em" }}
				width="100%"
			/>
		</>
	);
};
