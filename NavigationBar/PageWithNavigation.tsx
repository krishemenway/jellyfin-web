import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export const PageWithNavigation: React.FC<{ icon: React.ReactElement|BaseItemKind; children?: React.ReactNode; }> = (props) => {
	const icon = typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} size={22} /> : props.icon;

	return (
		<Layout direction="column" px="2em" py="1em" height="100%">
			<NavigationBar icon={icon} />
			<Layout direction="column" gap={16} className="page-content" children={props.children} grow />
		</Layout>
	);
};
