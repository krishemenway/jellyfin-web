import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { Login } from "Users/Login";
import { ServerService } from "Servers/ServerService";
import { ConnectToServer } from "Servers/ConnectToServer";
import { LoginService } from "Users/LoginService";
import { Layout } from "Common/Layout";

export const RequireServerAndUser: React.FC<{ children: React.ReactNode }> = (props) => {
	const servers = useObservable(ServerService.Instance.Servers);

	React.useEffect(() => LoginService.Instance.LoadUser(), [servers]);

	if (servers.length === 0) {
		return <Layout direction="column" height="100%" alignItems="center" justifyContent="center"><ConnectToServer minWidth="20em" maxWidth="28em" open={true} onClosed={() => { }} /></Layout>;
	}

	if (!servers[0].UserId) {
		return <Layout direction="column" height="100%" alignItems="center" justifyContent="center"><Login minWidth="20em" maxWidth="28em" /></Layout>;
	}

	return <>{React.Children.map(props.children, (c) => c)}</>;
};
