import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { BackdropService } from "Common/BackdropService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ThemeService } from "Users/ThemeService";

export const PageWithNavigation: React.FC<{ icon: React.ReactElement|BaseItemKind; children?: React.ReactNode; }> = (props) => {
	const backdropUrl = useObservable(BackdropService.Instance.CurrentBackdropImageUrl);
	const theme = useObservable(ThemeService.Instance.CurrentTheme);

	if (Nullable.HasValue(backdropUrl)) {
		return (
			<Layout key="page-with-navigation" direction="column" height="100%" backgroundRepeat="no-repeat" backgroundSize="cover" backgroundUrl={backdropUrl}>
				<Layout key="backdrop-suppressor" direction="column" px="2em" py="1em" height="100%" backgroundColor={theme.BackdropSuppressorColor}>
					<NavigationBar key="navigation-bar" icon={typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} /> : props.icon} />
					<Layout key="page-content" direction="column" gap="1em" className="page-content" children={props.children} grow />
				</Layout>
			</Layout>
		);
	} else {
		return (
			<Layout key="page-with-navigation" direction="column" px="2em" py="1em" height="100%">
				<NavigationBar key="navigation-bar" icon={typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} /> : props.icon} />
				<Layout key="page-content" direction="column" gap="1em" className="page-content" children={props.children} grow />
			</Layout>
		);
	}

};
