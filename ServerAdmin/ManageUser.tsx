import * as React from "react";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";
import { NavigateFunction, useParams } from "react-router-dom";
import { Observable } from "@residualeffect/reactor";
import { FieldError } from "Common/FieldError";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";
import { NumberField, TextField } from "Common/TextField";
import { TranslatedText } from "Common/TranslatedText";
import { useObservable } from "@residualeffect/rereactor";
import { PageIsLoading, PageWithNavigation } from "PageWithNavigation";
import { PeopleIcon } from "People/PeopleIcon";
import { ServerService } from "Servers/ServerService";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { HyperLink } from "Common/HyperLink";
import { useBackgroundStyles } from "AppStyles";
import { Receiver } from "Common/Receiver";
import { useNavigate } from "node_modules/react-router-dom/dist";
import { Loading, useIsBusy } from "Common/Loading";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { EditableUser } from "Users/EditableUser";
import { ToggleSwitch, ToggleSwitches } from "Common/ToggleSwitch";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { BaseItemDto, DeviceInfoDto, ParentalRating, SyncPlayUserAccessType, UnratedItem } from "node_modules/@jellyfin/sdk/lib/generated-client";
import { MultiSelectEditor, SelectFieldEditor } from "Common/SelectFieldEditor";
import { PageTitle } from "Common/PageTitle";
import { EditableField } from "Common/EditableField";
import { DeviceService } from "Device/DeviceService";
import { LocalizationOptionsStore } from "./LocalizationOptionsStore";

class ManageUserService {
	constructor() {
		this.EditableUser = new Receiver<EditableUser>("UnknownError");
		this.ShowErrors = new Observable(false);
		this.SaveUserResponse = new Receiver("UnknownError");
	}

	public LoadWithAbort(userId: string): () => void  {
		this.EditableUser.Start((a) => getUserApi(ServerService.Instance.CurrentApi).getUserById({ userId: userId }, { signal: a.signal }).then(r => new EditableUser(r.data)));
		return () => this.EditableUser.ResetIfLoading();
	}

	public Save(navigate: NavigateFunction): void {
		this.ShowErrors.Value = true;
		const user = this.EditableUser.Data.Value.ReceivedData!;

		if (user.CanMakeRequest.Value) {
			this.SaveUserResponse.Start((a) => getUserApi(ServerService.Instance.CurrentApi)
				.updateUser({ userDto: user.CreateRequest(), userId: user.From.Id! }, { signal: a.signal })
				.then(() => { navigate(`/Dashboard`); }));
		}
	}

	public EditableUser: Receiver<EditableUser>;
	public ShowErrors: Observable<boolean>;
	public SaveUserResponse: Receiver<void>;

	static get Instance(): ManageUserService {
		return this._instance ?? (this._instance = new ManageUserService());
	}

	private static _instance: ManageUserService;
}

export const ManageUser: React.FC = () => {
	const userId = useParams<{ userId: string; }>().userId!;
	const navigate = useNavigate();
	const background = useBackgroundStyles();
	const showErrors = useObservable(ManageUserService.Instance.ShowErrors);
	const isBusy = useIsBusy(ManageUserService.Instance.SaveUserResponse);

	React.useEffect(() => ManageUserService.Instance.LoadWithAbort(userId), [userId]);
	React.useEffect(() => DeviceService.Instance.LoadDevicesWithAbort(), []);
	React.useEffect(() => LocalizationOptionsStore.Instance.LoadParentalRatings(), []);

	return (
		<PageWithNavigation icon={<PeopleIcon />} content={(libraries) => (
			<Loading
				receivers={[ManageUserService.Instance.EditableUser, DeviceService.Instance.ServerDevices, LocalizationOptionsStore.Instance.ParentalRatings]}
				whenNotStarted={<PageIsLoading />} whenLoading={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(editableUser, devices, parentalRatings) => (
					<Form onSubmit={() => ManageUserService.Instance.Save(navigate)} direction="column" gap="1rem" py=".5rem" my="1rem">
						<PageTitle text={{ Key: "ButtonEditUser" }} />

						<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
							<Layout direction="column" gap=".5rem">
								<FieldLabel field={editableUser.Name} textKey="LabelUsername" />
								<TextField field={editableUser.Name} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" />
								<FieldError field={editableUser.Name} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableRemoteAccess} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableRemoteAccess} textKey="AllowRemoteAccess" />
								</Layout>

								<FieldError field={editableUser.EnableRemoteAccess} showErrors={showErrors} />
								<TranslatedText textKey="AllowRemoteAccessHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.IsAdministrator} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.IsAdministrator} textKey="OptionAllowUserToManageServer" />
								</Layout>

								<FieldError field={editableUser.IsAdministrator} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableCollectionManagement} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableCollectionManagement} textKey="AllowCollectionManagement" />
								</Layout>

								<FieldError field={editableUser.EnableCollectionManagement} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableSubtitleManagement} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableSubtitleManagement} textKey="AllowSubtitleManagement" />
								</Layout>

								<FieldError field={editableUser.EnableSubtitleManagement} showErrors={showErrors} />
							</Layout>


							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableContentDownloading} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableContentDownloading} textKey="OptionAllowContentDownload" />
								</Layout>

								<FieldError field={editableUser.EnableContentDownloading} showErrors={showErrors} />
								<TranslatedText textKey="OptionAllowContentDownloadHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.IsDisabled} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.IsDisabled} textKey="OptionDisableUser" />
								</Layout>

								<FieldError field={editableUser.IsDisabled} showErrors={showErrors} />
								<TranslatedText textKey="OptionDisableUserHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.IsHidden} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.IsHidden} textKey="OptionHideUser" />
								</Layout>

								<FieldError field={editableUser.IsHidden} showErrors={showErrors} />
								<TranslatedText textKey="OptionHideUserFromLoginHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<NumberField field={editableUser.LoginAttemptsBeforeLockout} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" width="5rem" />
									<FieldLabel field={editableUser.LoginAttemptsBeforeLockout} textKey="LabelUserLoginAttemptsBeforeLockout" />
								</Layout>

								<FieldError field={editableUser.LoginAttemptsBeforeLockout} showErrors={showErrors} />
								<TranslatedText textKey="OptionLoginAttemptsBeforeLockout" elementType="div" layout={{ fontColor: "Secondary" }} />
								<TranslatedText textKey="OptionLoginAttemptsBeforeLockoutHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<NumberField field={editableUser.MaxActiveSessions} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" width="5rem" />
									<FieldLabel field={editableUser.MaxActiveSessions} textKey="LabelUserMaxActiveSessions" />
								</Layout>

								<FieldError field={editableUser.MaxActiveSessions} showErrors={showErrors} />
								<TranslatedText textKey="OptionMaxActiveSessionsHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>
						</Layout>

						<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
							<TranslatedText textKey="HeaderFeatureAccess" elementType="div" layout={{ fontSizeREM: 1.1 }} />

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableLiveTvAccess} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableLiveTvAccess} textKey="OptionAllowBrowsingLiveTv" />
								</Layout>

								<FieldError field={editableUser.EnableLiveTvAccess} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableLiveTvManagement} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableLiveTvManagement} textKey="OptionAllowManageLiveTv" />
								</Layout>

								<FieldError field={editableUser.EnableLiveTvManagement} showErrors={showErrors} />
							</Layout>
						</Layout>

						<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
							<TranslatedText textKey="HeaderPlayback" elementType="div" layout={{ fontSizeREM: 1.1 }} />

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableMediaPlayback} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableMediaPlayback} textKey="OptionAllowMediaPlayback" />
								</Layout>

								<FieldError field={editableUser.EnableMediaPlayback} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableAudioPlaybackTranscoding} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableAudioPlaybackTranscoding} textKey="OptionAllowAudioPlaybackTranscoding" />
								</Layout>

								<FieldError field={editableUser.EnableAudioPlaybackTranscoding} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableVideoPlaybackTranscoding} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableVideoPlaybackTranscoding} textKey="OptionAllowVideoPlaybackTranscoding" />
								</Layout>

								<FieldError field={editableUser.EnableVideoPlaybackTranscoding} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnablePlaybackRemuxing} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnablePlaybackRemuxing} textKey="OptionAllowVideoPlaybackRemuxing" />
								</Layout>

								<FieldError field={editableUser.EnablePlaybackRemuxing} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.ForceRemoteSourceTranscoding} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.ForceRemoteSourceTranscoding} textKey="OptionForceRemoteSourceTranscoding" />
								</Layout>

								<FieldError field={editableUser.ForceRemoteSourceTranscoding} showErrors={showErrors} />
							</Layout>

							<TranslatedText textKey="OptionAllowMediaPlaybackTranscodingHelp" elementType="div" layout={{ fontColor: "Secondary" }} />

							<Layout direction="column" gap=".25rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<NumberField field={editableUser.RemoteClientBitrateLimit} bt br bb bl backgroundColor="Field" px=".25em" py=".25em" width="5rem" />
									<FieldLabel field={editableUser.RemoteClientBitrateLimit} textKey="LabelRemoteClientBitrateLimit" />
								</Layout>

								<FieldError field={editableUser.RemoteClientBitrateLimit} showErrors={showErrors} />
								<TranslatedText textKey="LabelRemoteClientBitrateLimitHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
								<TranslatedText textKey="LabelUserRemoteClientBitrateLimitHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>

							<Layout direction="column" gap=".25rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<SelectFieldEditor
										field={editableUser.SyncPlayAccess}
										allOptions={Object.keys(SyncPlayUserAccessType).map(t => t as SyncPlayUserAccessType)}
										getLabel={o => <TranslatedText textKey={`LabelSyncPlayAccess${o}`} />}
										getValue={o => o}
										getKey={o => o}
										px=".25em" py=".25em"
									/>
									<FieldLabel field={editableUser.SyncPlayAccess} textKey="LabelSyncPlayAccess" />
								</Layout>

								<FieldError field={editableUser.SyncPlayAccess} showErrors={showErrors} />
								<TranslatedText textKey="SyncPlayAccessHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
							</Layout>
						</Layout>

						<Libraries editableUser={editableUser} libraries={libraries} parentalRatings={parentalRatings} showErrors={showErrors} />
						<Devices editableUser={editableUser} devices={devices} />

						<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
							<TranslatedText textKey="HeaderRemoteControl" elementType="div" layout={{ fontSizeREM: 1.1 }} />

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableRemoteControlOfOtherUsers} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableRemoteControlOfOtherUsers} textKey="OptionAllowRemoteControlOthers" />
								</Layout>

								<FieldError field={editableUser.EnableRemoteControlOfOtherUsers} showErrors={showErrors} />
							</Layout>

							<Layout direction="column" gap=".5rem">
								<Layout direction="row" gap=".5rem" alignItems="center">
									<ToggleSwitch field={editableUser.EnableSharedDeviceControl} px=".25em" py=".25em" />
									<FieldLabel field={editableUser.EnableSharedDeviceControl} textKey="OptionAllowRemoteSharedDevices" />
								</Layout>

								<FieldError field={editableUser.EnableSharedDeviceControl} showErrors={showErrors} />
							</Layout>

							<TranslatedText textKey="OptionAllowRemoteSharedDevicesHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
						</Layout>

						<Layout direction="row" gap=".5rem" justifyContent="end">
							<HyperLink to="/Dashboard" direction="row" label="ButtonCancel" classes={[background.button]} px=".25em" py=".25em" onClick={() => editableUser.Reset()} />
							<Button type="submit" label="Save" px=".25em" py=".25em" disabled={isBusy} hiddenLabel={isBusy} icon={isBusy ? <LoadingIcon /> : <></>} />
						</Layout>
					</Form>
				)}
			/>
		)} />
	);
};

const Libraries: React.FC<{ editableUser: EditableUser; libraries: BaseItemDto[]; parentalRatings: ParentalRating[]; showErrors: boolean; }> = ({ editableUser, libraries, parentalRatings }) => {
	const allFoldersEnabled = useObservable(editableUser.EnableAllFolders.Current);
	const allLibrariesEnabledField = React.useMemo(() => new EditableField<string[]>("AllLibrariesEnabledField", libraries.map(l => l.Id!)), [libraries]);
	const mediaDeletionEnabled = useObservable(editableUser.EnableContentDeletion.Current);

	return (
		<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
			<TranslatedText textKey="HeaderLibraryAccess" elementType="div" layout={{ fontSizeREM: 1.1 }} />

			<Layout direction="row" gap=".5rem" alignItems="center">
				<ToggleSwitch field={editableUser.EnableAllFolders} />
				<FieldLabel field={editableUser.EnableAllFolders} textKey="OptionEnableAccessToAllLibraries" />
			</Layout>

			<Layout direction="column" gap=".5rem" backgroundColor="Panel" px="1rem">
				<TranslatedText textKey="LibraryAccessHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
				<Layout direction="row" maxWidth="40rem" wrap gap="1rem">
					<ToggleSwitches
						field={allFoldersEnabled ? allLibrariesEnabledField : editableUser.EnabledFolders}
						allValues={libraries}
						getLabel={(i) => i.Name!}
						getValue={(i) => i.Id!}
						switchWrapperLayout={{ gap: ".5rem", alignItems: "center" }}
						canChange={allFoldersEnabled}
					/>
				</Layout>
			</Layout>

			<Layout direction="row" gap=".5rem" alignItems="center">
				<ToggleSwitch field={editableUser.EnableContentDeletion} />
				<FieldLabel field={editableUser.EnableContentDeletion} textKey="OptionEnableContentDeletion" />
			</Layout>

			<Layout direction="column" gap=".5rem" backgroundColor="Panel" px="1rem">
				<TranslatedText textKey="LibraryAccessHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
				<Layout direction="row" maxWidth="40rem" wrap gap="1rem">
					<ToggleSwitches
						field={mediaDeletionEnabled ? allLibrariesEnabledField : editableUser.EnableContentDeletionFromFolders}
						allValues={libraries}
						getLabel={(i) => i.Name!}
						getValue={(i) => i.Id!}
						switchWrapperLayout={{ gap: ".5rem", alignItems: "center" }}
						canChange={mediaDeletionEnabled}
					/>
				</Layout>
			</Layout>

			<Layout direction="column" gap=".5rem" backgroundColor="Panel">
				<Layout direction="row" gap="1rem">
					<SelectFieldEditor
						allOptions={parentalRatings}
						field={editableUser.MaxParentalRating}
						getKey={o => o.Name!}
						getLabel={(i) => i.Name!}
						getValue={(i) => i.Value!}
						py=".25em"
					/>
					<FieldLabel field={editableUser.MaxParentalRating} textKey="LabelMaxParentalRating" />
				</Layout>
				<TranslatedText textKey="MaxParentalRatingHelp" elementType="div" layout={{ fontColor: "Secondary" }}  />
			</Layout>

			<Layout direction="column" gap=".5rem" backgroundColor="Panel" maxWidth="40rem">
				<TranslatedText textKey="HeaderBlockItemsWithNoRating" elementType="div" />
				<MultiSelectEditor
					allOptions={Object.keys(UnratedItem).map(ui => ui as UnratedItem)}
					field={editableUser.BlockUnratedItems}
					getLabel={(i) => i}
					getValue={(i) => i}
				/>
			</Layout>

			<Layout direction="column" gap=".5rem" maxWidth="40rem">
				<TranslatedText textKey="LabelAllowContentWithTags" elementType="div" />
				<MultiSelectEditor
					allOptions={[]}
					field={editableUser.AllowedTags}
					getLabel={o => o}
					getValue={o => o}
					createNew={(newTag) => newTag}
				/>
			</Layout>

			<Layout direction="column" gap=".5rem" maxWidth="40rem">
				<TranslatedText textKey="LabelBlockContentWithTags" elementType="div" />
				<MultiSelectEditor
					allOptions={[]}
					field={editableUser.BlockedTags}
					getLabel={o => o}
					getValue={o => o}
					createNew={(newTag) => newTag}
				/>
			</Layout>
		</Layout>
	);
};

const Devices: React.FC<{ editableUser: EditableUser; devices: DeviceInfoDto[] }> = ({ editableUser, devices }) => {
	const allDevicesEnabled = useObservable(editableUser.EnableAllDevices.Current);
	const allDevicesEnabledField = React.useMemo(() => new EditableField<string[]>("AllDevicesEnabledField", devices.map(l => l.Id!)), [devices]);

	return (
		<Layout direction="column" backgroundColor="Panel" px="1rem" py="1rem" gap="1rem">
			<TranslatedText textKey="HeaderDevices" elementType="div" layout={{ fontSizeREM: 1.1 }} />

			<Layout direction="row" gap=".5rem" alignItems="center">
				<ToggleSwitch field={editableUser.EnableAllDevices} />
				<FieldLabel field={editableUser.EnableAllDevices} textKey="OptionEnableAccessFromAllDevices" />
			</Layout>

			<Layout direction="column" gap=".5rem" backgroundColor="Panel" px="1rem">
				<Layout direction="row" maxWidth="50rem" wrap gap="1rem">
					<ToggleSwitches
						field={allDevicesEnabled ? allDevicesEnabledField : editableUser.EnabledDevices}
						allValues={devices}
						getLabel={(i) => `${i.Name} ${i.AppName}`}
						getValue={(i) => i.Id!}
						switchWrapperLayout={{ gap: ".5rem", alignItems: "center" }}
						canChange={allDevicesEnabled}
					/>
					<TranslatedText textKey="DeviceAccessHelp" elementType="div" layout={{ fontColor: "Secondary" }} />
				</Layout>
			</Layout>
		</Layout>
	);
};
