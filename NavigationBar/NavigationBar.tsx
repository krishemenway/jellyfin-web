import * as React from "react";
import { BaseItemDto, SystemInfo, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useBackgroundStyles } from "AppStyles";
import { Button } from "Common/Button";
import { EditIcon } from "CommonIcons/EditIcon";
import { HyperLink } from "Common/HyperLink";
import { JellyfinIcon } from "CommonIcons/JellyfinIcon";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { AnchoredModal, CenteredModal } from "Common/Modal";
import { TranslatedText } from "Common/TranslatedText";
import { IconForItem } from "Items/IconForItem";
import { MenuIcon } from "NavigationBar/MenuIcon";
import { Search } from "NavigationBar/Search";
import { DashboardIcon } from "ServerAdmin/DashboardIcon";
import { ServerService } from "Servers/ServerService";
import { AuthorizeQuickConnect } from "Users/AuthorizeQuickConnect";
import { LoginService } from "Users/LoginService";
import { SettingsIcon } from "Users/SettingsIcon";
import { SignOutIcon } from "Users/SignOutIcon";
import { UserViewStore } from "Users/UserViewStore";
import { LinkToItem } from "Items/LinkToItem";
import { ChangeServerButton } from "Servers/ChangeServerButton";
import { QuickConnectService } from "Users/QuickConnect";
import { useObservable } from "@residualeffect/rereactor";
import { MediaPlayer } from "MediaPlayer/MediaPlayer";

export const NavigationBar: React.FC<{ icon?: React.ReactElement; }> = (props) => {
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
				whenReceived={(libraries, server, quickConnectEnabled, user) => (
					<>
						<OpenNavigationButton libraries={libraries} server={server} quickConnectEnabled={quickConnectEnabled} />
						<MediaPlayer user={user} libraries={libraries} />
					</>
				)}
			/>
			{props.icon && (<Layout direction="row" alignItems="center" fontSize="1.5em">{props.icon}</Layout>)}
			<Layout direction="row" alignItems="center"><Search /></Layout>
		</Layout>
	);
};

const NavigationButton: React.FC<{ onClick?: (element: HTMLButtonElement) => void; }> = (props) => {
	return <Button direction="row" type="button" disabled={props.onClick === undefined} onClick={props.onClick ?? (() => { })} py=".25em" px=".25em"><MenuIcon size="1.5em" /></Button>;
}

const NavigationMenuLinkStyles: Partial<StyleLayoutProps> = { width: "100%", px: "1em", py: "1em", gap: ".5em" };
const OpenNavigationButton: React.FC<{ libraries: BaseItemDto[]; server: SystemInfo; quickConnectEnabled: boolean }> = ({ libraries, server, quickConnectEnabled }) => {
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
						<Layout direction="row" elementType="h3" py="1em" px="1em"><TranslatedText textKey="HeaderLibraries" /></Layout>
						<ListOf
							direction="row" wrap
							items={libraries}
							forEachItem={(library) => (
								<LinkToItem
									key={library.Id} item={library}
									direction="column" alignItems="center"
									px=".5em" py=".5em" gap=".5em" width={{ itemsPerRow: 3 }}
								>
									<Layout direction="row" justifyContent="center"><IconForItem item={library} size="1.5em" /></Layout>
									<Layout direction="row" justifyContent="center">{library.Name}</Layout>
								</LinkToItem>
							)}
						/>
					</Layout>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" elementType="h3" py="1em" px="1em"><TranslatedText textKey="HeaderAdmin" /></Layout>

						<NavigationMenuItemHyperLink to="/Dashboard" icon={<DashboardIcon />} text={<TranslatedText textKey="TabDashboard" />} />
						<NavigationMenuItemHyperLink to="/Metadata" icon={<EditIcon />} text={<TranslatedText textKey="MetadataManager" />} />
					</Layout>

					<Layout direction="column">
						<NavigationDivider />
						<Layout direction="row" elementType="h3" py="1em" px="1em"><TranslatedText textKey="UserMenu" /></Layout>

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
