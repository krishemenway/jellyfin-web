import * as React from "react";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Button } from "Common/Button";
import { useObservable } from "@residualeffect/rereactor";
import { ServerConnection, ServerService } from "Servers/ServerService";
import { useBackgroundStyles } from "Common/AppStyles";
import { ConnectToServer } from "Servers/ConnectToServer";

const SelectServerButton: React.FC<{ server: ServerConnection }> = (props) => {
	return (
		<Button direction="row" type="button" children={props.server.Name} onClick={() => { ServerService.Instance.SelectServerConnection(props.server); }} />
	);
};

export const Servers: React.FC = () => {
	const background = useBackgroundStyles();
	const servers = useObservable(ServerService.Instance.Servers);
	React.useEffect(() => { ServerService.Instance.AttemptSetupOfCurrentDomainAsServer(); }, []);

	return (
		<Layout direction="column" className={background.panel}>
			<ListOf
				items={servers}
				direction="column"
				forEachItem={(server) => <SelectServerButton key={server.Id} server={server} />}
			/>

			<ConnectToServer />
		</Layout>
	);
};
