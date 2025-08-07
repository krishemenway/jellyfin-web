import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export const PageWithNavigation: React.FC<{ icon: React.ReactElement|BaseItemKind; children?: React.ReactNode; }> = (props) => {
	return (
		<Layout direction="column" px="2em" py="1em" height="100%">
			<NavigationBar icon={typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} /> : props.icon} />
			<Layout direction="column" gap="1em" className="page-content" children={props.children} grow />
		</Layout>
	);
};
