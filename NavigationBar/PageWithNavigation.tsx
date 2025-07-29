import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";

export const PageWithNavigation: React.FC<{ icon?: React.ReactElement; itemKind?: BaseItemKind; children?: React.ReactNode; }> = (props) => {
	return (
		<Layout direction="column" px="2em" py="1em">
			<NavigationBar icon={props.icon ?? <IconForItemKind itemKind={props.itemKind} size={22} />} />
			<Layout direction="column" gap={16} className="page-content" children={props.children} />
		</Layout>
	);
};
