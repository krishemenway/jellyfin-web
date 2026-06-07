import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { BackdropService } from "Common/BackdropService";
import { ThemeService } from "Themes/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LoadingIcon } from "Common/LoadingIcon";

export const PageWithNavigation: React.FC<{ icon: React.ReactElement|BaseItemKind; children?: React.ReactNode; matchHeight?: boolean }> = (props) => {
	const backdropUrl = useObservable(BackdropService.Instance.CurrentBackdropImageUrl);
	const theme = useObservable(ThemeService.Instance.CurrentTheme);

	return (
		<Layout key="page-with-navigation" direction="column" backgroundRepeat="no-repeat" backgroundSize="cover" backgroundUrl={backdropUrl} height="100%">
			<Layout key="backdrop-suppressor" direction="column" px="2em" py="1em" backgroundColor={Nullable.HasValue(backdropUrl) ? theme.BackdropSuppressorColor : undefined} height="100%">
				<NavigationBar key="navigation-bar" icon={typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} /> : props.icon} />
				<Layout key="page-content" direction="column" gap="1em" className="page-content" children={props.children} grow height={(props.matchHeight ?? false) ? "100%" : undefined} />
			</Layout>
		</Layout>
	);
};

export const PageIsLoading: React.FC = () => (
	<Layout direction="column" justifyContent="center" height="100%"><LoadingIcon alignSelf="center" size="4em" /></Layout>
);
