import * as React from "react";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { IconForItemKind } from "Items/IconForItemKind";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { BackdropService } from "Common/BackdropService";
import { ThemeService } from "Themes/ThemeService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LoadingIcon } from "Common/LoadingIcon";
import { BaseItemDto, SystemInfo, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { Button } from "Common/Button";
import { EditIcon } from "CommonIcons/EditIcon";
import { HyperLink } from "Common/HyperLink";
import { JellyfinIcon } from "CommonIcons/JellyfinIcon";
import { Loading } from "Common/Loading";
import { AnchoredModal, CenteredModal } from "Common/Modal";
import { TranslatedText } from "Common/TranslatedText";
import { IconForItem } from "Items/IconForItem";
import { MenuIcon } from "CommonIcons/MenuIcon";
import { Search } from "Search/Search";
import { ServerIcon } from "Servers/ServerIcon";
import { ServerService } from "Servers/ServerService";
import { AuthorizeQuickConnect } from "Users/AuthorizeQuickConnect";
import { LoginService } from "Users/LoginService";
import { SettingsIcon } from "Users/SettingsIcon";
import { SignOutIcon } from "Users/SignOutIcon";
import { UserViewStore } from "Users/UserViewStore";
import { LinkToItem } from "Items/LinkToItem";
import { ChangeServerButton } from "Servers/ChangeServerButton";
import { QuickConnectService } from "Users/QuickConnect";

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

const NavigationBar: React.FC<{ icon?: React.ReactElement; }> = (props) => {
	const background = useBackgroundStyles();
	const userId = useObservable(ServerService.Instance.CurrentUserId);

	React.useEffect(() => UserViewStore.Instance.LoadUserViewsWithAbort(userId), [userId]);
	React.useEffect(() => ServerService.Instance.LoadServerInfoWithAbort(), [userId]);
	React.useEffect(() => QuickConnectService.Instance.LoadQuickConnectEnabled(), [userId]);

	return (
		<Layout className={background.panel} direction="row" gap="1em" px="1em" py=".5em" width="calc(100% + 2em)" mx="-1em">
			<Loading
				receivers={[UserViewStore.Instance.FindOrCreateForUser(userId), ServerService.Instance.ServerInfo, QuickConnectService.Instance.QuickConnectEnabled, LoginService.Instance.User]}
				whenNotStarted={<NavigationButton />}
				whenLoading={<NavigationButton />}
				whenError={() => <NavigationButton />}
				whenReceived={(libraries, server, quickConnectEnabled, user) => <OpenNavigationButton libraries={libraries} server={server} quickConnectEnabled={quickConnectEnabled} user={user} />}
			/>
			{props.icon && (<Layout direction="row" alignItems="center" fontSizeREM={1.5}>{props.icon}</Layout>)}
			<Layout direction="row" alignItems="center"><Search /></Layout>
		</Layout>
	);
};

const NavigationButton: React.FC<{ onClick?: (element: HTMLButtonElement) => void; }> = (props) => {
	return (
		<Button
			type="button" onClick={props.onClick ?? (() => { })}
			icon={<MenuIcon />} fontSizeREM={1.5}
			disabled={props.onClick === undefined}
			py=".25em" px=".25em" transparent
		/>
	);
}

const NavigationMenuLinkStyles: Partial<StyleLayoutProps> = { width: "100%", px: "1em", py: "1em", gap: ".5em" };
const OpenNavigationButton: React.FC<{ libraries: BaseItemDto[]; server: SystemInfo; quickConnectEnabled: boolean; user: UserDto }> = ({ libraries, server, quickConnectEnabled, user }) => {
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => { setOpenAnchor(null); };

	return (
		<>
			<NavigationButton onClick={(element) => { setOpenAnchor(element); }} />
			<AnchoredModal alternatePanel open={anchor !== null} onClosed={closeNavigation} opensInDirection="right" anchorElement={anchor}>
				<Layout direction="column" maxWidth="20em">
					<HyperLink direction="row" to="/" gap="1em" py="1em" px="1em">
						<JellyfinIcon size="3em" />

						<Layout direction="column" gap=".25em" justifyContent="center">
							<h6>{server.ServerName}</h6>
							<p>{server.Version}</p>
						</Layout>
					</HyperLink>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" wrap>
							{libraries.map((library) => (
								<LinkToItem
									key={library.Id} item={library}
									direction="column" alignItems="center"
									px=".5em" py=".5em" gap=".5em" width={{ itemsPerRow: 3 }}
								>
									<Layout direction="row" justifyContent="center"><IconForItem item={library} size="1.5em" /></Layout>
									<Layout direction="row" justifyContent="center" textAlign="center">{library.Name}</Layout>
								</LinkToItem>
							))}

							{user.Policy?.IsAdministrator && (
								<HyperLink
									to="/Dashboard"
									direction="column" alignItems="center"
									px=".5em" py=".5em" gap=".5em" width={{ itemsPerRow: 3 }}
								>
									<Layout direction="row" justifyContent="center"><ServerIcon size="1.5em" /></Layout>
									<Layout direction="row" justifyContent="center"><TranslatedText textKey="TabServer" /></Layout>
								</HyperLink>
							)}
						</Layout>
					</Layout>

					<Layout direction="column">
						<NavigationDivider />
						<NavigationMenuItemHyperLink to="/Settings" icon={<SettingsIcon />} text={<TranslatedText textKey="Settings" />} />
						{quickConnectEnabled && <AuthorizeQuickConnectButton onOpened={closeNavigation} />}
						<ChangeServerButton transparent {...NavigationMenuLinkStyles} onOpened={closeNavigation} />
						<NavigationMenuItemButton icon={<SignOutIcon />} text={<TranslatedText textKey="ButtonSignOut" />} onClick={() => { closeNavigation(); LoginService.Instance.SignOut(); }} />
					</Layout>
				</Layout>
			</AnchoredModal>
		</>
	);
};

const AuthorizeQuickConnectButton: React.FC<{ onOpened: () => void }> = (props) => {
	const [authorizeQuickConnectOpen, setAuthorizeQuickConnectOpen] = React.useState(false);

	// TODO check if the server supports quick connect and bail early if it doesn't

	return (
		<>
			<NavigationMenuItemButton
				icon={<EditIcon />}
				text={<TranslatedText textKey="QuickConnect" />}
				onClick={() => { props.onOpened(); setAuthorizeQuickConnectOpen(true); }}
			/>

			<CenteredModal open={authorizeQuickConnectOpen} onClosed={() => { setAuthorizeQuickConnectOpen(false); }}>
				<AuthorizeQuickConnect open={authorizeQuickConnectOpen} onClose={() => { setAuthorizeQuickConnectOpen(false); }} />
			</CenteredModal>
		</>
	);
};

const NavigationMenuItemHyperLink: React.FC<{ text: React.ReactElement, icon: React.ReactElement, to: string; }> = (props) => {
	return (
		<HyperLink {...NavigationMenuLinkStyles} direction="row" to={props.to}>
			<Layout direction="row" justifyContent="center" position="relative" top="1px">{props.icon}</Layout>
			<Layout direction="row" justifyContent="center">{props.text}</Layout>
		</HyperLink>
	);
};

const NavigationMenuItemButton: React.FC<{ text: React.ReactElement, icon: React.ReactElement, onClick: () => void; }> = (props) => {
	return (
		<Button transparent {...NavigationMenuLinkStyles} direction="row" type="button" onClick={props.onClick}>
			<Layout direction="row" justifyContent="center" position="relative" top="1px">{props.icon}</Layout>
			<Layout direction="row" justifyContent="center">{props.text}</Layout>
		</Button>
	);
};

const NavigationDivider: React.FC = () => {
	return <hr style={{ width: "100%", margin: "0", borderWidth: "thin" }} />;
}
