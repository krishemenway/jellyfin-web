import * as React from "react";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Button } from "Common/Button";
import { useObservable } from "@residualeffect/rereactor";
import { ServerService } from "Servers/ServerService";
import { useBackgroundStyles } from "AppStyles";
import { ConnectToServer } from "Servers/ConnectToServer";
import { ServerIcon } from "Servers/ServerIcon";
import { TranslatedText } from "Common/TranslatedText";
import { DeleteIcon } from "CommonIcons/DeleteIcon";

export const Servers: React.FC = () => {
	const background = useBackgroundStyles();
	const servers = useObservable(ServerService.Instance.Servers);
	React.useEffect(() => { ServerService.Instance.AttemptSetupOfCurrentDomainAsServer(); }, []);

	return (
		<Layout direction="column" gap="1em">
			<Layout direction="column" className={background.panel} gap="1em" px="1em" py="1em" minWidth="20em">
				<Layout direction="row" elementType="h2" fontSize="1.2em"><TranslatedText textKey="SelectServer" /></Layout>

				<ListOf
					items={servers}
					direction="column"
					gap=".5em"
					forEachItem={(server) => (
						<Layout key={server.Id} direction="row" position="relative">
							<Button
								transparent px="1em" py="1em" textAlign="start" width="80%" gap="1em"
								type="button" onClick={() => ServerService.Instance.SelectServerConnection(server)}
								selected={server === ServerService.Instance.CurrentServer}
								children={server.Name} icon={<ServerIcon />}
							/>

							<Button
								type="button" onClick={() => { ServerService.Instance.Remove(server); }}
								direction="column" alignItems="center" justifyContent="center" transparent
								position="absolute" top={0} bottom={0} right={0} width="20%"
								selected={server === ServerService.Instance.CurrentServer}
								icon={<DeleteIcon />}
							/>
						</Layout>
					)}
				/>
			</Layout>
			
			<ConnectToServer />
		</Layout>
	);
};
