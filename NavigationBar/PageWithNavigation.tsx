import * as React from "react";
import { Layout } from "Common/Layout";
import { NavigationBar } from "NavigationBar/NavigationBar";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { BackdropService } from "Common/BackdropService";
import { ThemeService } from "Themes/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { MediaPlayer } from "MediaPlayer/MediaPlayer";
import { LoginService } from "Users/LoginService";
import { Loading } from "Common/Loading";

export const PageWithNavigation: React.FC<{ icon: React.ReactElement|BaseItemKind; children?: React.ReactNode; matchHeight?: boolean }> = (props) => {
	const heightProps = (props.matchHeight ?? false) ? { height: "100%" } : {};
	const backdropUrl = useObservable(BackdropService.Instance.CurrentBackdropImageUrl);
	const theme = useObservable(ThemeService.Instance.CurrentTheme);

	return (
		<Layout key="page-with-navigation" direction="column" backgroundRepeat="no-repeat" backgroundSize="cover" backgroundUrl={backdropUrl} {...heightProps}>
			<Layout key="backdrop-suppressor" direction="column" px="2em" py="1em" backgroundColor={Nullable.HasValue(backdropUrl) ? theme.BackdropSuppressorColor : undefined} {...heightProps}>
				<NavigationBar key="navigation-bar" icon={typeof props.icon === "string" ? <IconForItemKind itemKind={props.icon} /> : props.icon} />
				<Layout key="page-content" direction="column" gap="1em" className="page-content" children={props.children} grow  {...heightProps} />
				<Loading receivers={[LoginService.Instance.User]} whenNotStarted={<></>} whenLoading={<></>} whenError={() => <></>} whenReceived={(user) => <MediaPlayer user={user} />} />
			</Layout>
		</Layout>
	);
};
