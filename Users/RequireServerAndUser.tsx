import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { Login } from "Users/Login";
import { ServerService } from "Servers/ServerService";
import { ConnectToServer } from "Servers/ConnectToServer";
import { LoginService } from "Users/LoginService";
import { Layout } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

export const RequireServerAndUser: React.FC<{ children: React.ReactNode }> = (props) => {
	const servers = useObservable(ServerService.Instance.Servers);
	const currentServer = useObservable(ServerService.Instance.CurrentServer);

	React.useEffect(() => LoginService.Instance.LoadUser(), [servers]);

	if (Nullable.HasValue(currentServer) && Nullable.StringHasValue(currentServer?.UserId)) {
		return <>{React.Children.map(props.children, (c) => c)}</>;
	}

	if (Nullable.HasValue(currentServer)) {
		return <Layout direction="column" height="100%" alignItems="center" justifyContent="center"><Login server={currentServer} minWidth="20em" maxWidth="28em" /></Layout>;
	}

	return <Layout direction="column" height="100%" alignItems="center" justifyContent="center"><ConnectToServer minWidth="20em" maxWidth="28em" open={true} onClosed={() => { }} /></Layout>;
};
