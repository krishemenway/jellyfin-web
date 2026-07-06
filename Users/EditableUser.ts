import { UserDto } from "@jellyfin/sdk/lib/generated-client";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";

export class EditableUser {
	constructor(user: UserDto) {
		this.From = user;

		this.Name = new EditableField<string>("Name", user.Name ?? "", ValueIsRequired);
		this.EnableAutoLogin = new EditableField<boolean>("EnableAutoLogin", user.EnableAutoLogin ?? false);
		this.IsAdministrator = new EditableField<boolean>("IsAdministrator", user.Policy?.IsAdministrator ?? false);
		this.EnableRemoteAccess = new EditableField<boolean>("EnableRemoteAccess", user.Policy?.EnableRemoteAccess ?? false);
		this.EnableCollectionManagement = new EditableField<boolean>("EnableCollectionManagement", user.Policy?.EnableCollectionManagement ?? false);
		this.EnableSubtitleManagement = new EditableField<boolean>("EnableSubtitleManagement", user.Policy?.EnableSubtitleManagement ?? false);

		this.HasChanged = new Computed(() => this.AllFields().every(f => f.HasChanged.Value))
		this.CanMakeRequest = new Computed(() => this.AllFields().every(f => f.CanMakeRequest()))
	}

	public Reset(): void {
		this.AllFields().forEach(f => f.Revert());
	}

	public CreateRequest(): UserDto {
		return {
			Id: this.From.Id,
			Name: this.Name.Current.Value,
			EnableAutoLogin: this.EnableAutoLogin.Current.Value,
			PrimaryImageTag: this.From.PrimaryImageTag,
			PrimaryImageAspectRatio: this.From.PrimaryImageAspectRatio,
			Configuration: this.From.Configuration,
			Policy: {
				IsAdministrator: this.IsAdministrator.Current.Value,
				IsHidden: this.From.Policy?.IsHidden,
				EnableCollectionManagement: this.EnableCollectionManagement.Current.Value,
				EnableSubtitleManagement: this.EnableSubtitleManagement.Current.Value,
				EnableLyricManagement: this.From.Policy?.EnableLyricManagement,
				IsDisabled: this.From.Policy?.IsDisabled,
				MaxParentalRating: this.From.Policy?.MaxParentalRating,
				MaxParentalSubRating: this.From.Policy?.MaxParentalSubRating,
				BlockedTags: this.From.Policy?.BlockedTags,
				AllowedTags: this.From.Policy?.AllowedTags,
				EnableUserPreferenceAccess: this.From.Policy?.EnableUserPreferenceAccess,
				AccessSchedules: this.From.Policy?.AccessSchedules,
				BlockUnratedItems: this.From.Policy?.BlockUnratedItems,
				EnableRemoteControlOfOtherUsers: this.From.Policy?.EnableRemoteControlOfOtherUsers,
				EnableSharedDeviceControl: this.From.Policy?.EnableSharedDeviceControl,
				EnableRemoteAccess: this.EnableRemoteAccess.Current.Value,
				EnableLiveTvManagement: this.From.Policy?.EnableLiveTvManagement,
				EnableLiveTvAccess: this.From.Policy?.EnableLiveTvAccess,
				EnableMediaPlayback: this.From.Policy?.EnableMediaPlayback,
				EnableAudioPlaybackTranscoding: this.From.Policy?.EnableAudioPlaybackTranscoding,
				EnableVideoPlaybackTranscoding: this.From.Policy?.EnableVideoPlaybackTranscoding,
				EnablePlaybackRemuxing: this.From.Policy?.EnablePlaybackRemuxing,
				ForceRemoteSourceTranscoding: this.From.Policy?.ForceRemoteSourceTranscoding,
				EnableContentDeletion: this.From.Policy?.EnableContentDeletion,
				EnableContentDeletionFromFolders: this.From.Policy?.EnableContentDeletionFromFolders,
				EnableContentDownloading: this.From.Policy?.EnableContentDownloading,
				EnableSyncTranscoding: this.From.Policy?.EnableSyncTranscoding,
				EnableMediaConversion: this.From.Policy?.EnableMediaConversion,
				EnabledDevices: this.From.Policy?.EnabledDevices,
				EnableAllDevices: this.From.Policy?.EnableAllDevices,
				EnabledChannels: this.From.Policy?.EnabledChannels,
				EnableAllChannels: this.From.Policy?.EnableAllChannels,
				EnabledFolders: this.From.Policy?.EnabledFolders,
				EnableAllFolders: this.From.Policy?.EnableAllFolders,
				InvalidLoginAttemptCount: this.From.Policy?.InvalidLoginAttemptCount,
				LoginAttemptsBeforeLockout: this.From.Policy?.LoginAttemptsBeforeLockout,
				MaxActiveSessions: this.From.Policy?.MaxActiveSessions,
				EnablePublicSharing: this.From.Policy?.EnablePublicSharing,
				BlockedMediaFolders: this.From.Policy?.BlockedMediaFolders,
				BlockedChannels: this.From.Policy?.BlockedChannels,
				RemoteClientBitrateLimit: this.From.Policy?.RemoteClientBitrateLimit,
				AuthenticationProviderId: this.From.Policy?.AuthenticationProviderId ?? "",
				PasswordResetProviderId: this.From.Policy?.PasswordResetProviderId ?? "",
				SyncPlayAccess: this.From.Policy?.SyncPlayAccess,
			},
		};
	}

	private AllFields(): IEditableField[] {
		return [
			this.Name,
			this.EnableAutoLogin,
			this.IsAdministrator,
			this.EnableRemoteAccess,
			this.EnableCollectionManagement,
			this.EnableSubtitleManagement,
		];
	}

	public HasChanged: Computed<boolean>;
	public CanMakeRequest: Computed<boolean>;

	public From: UserDto;

	public Name: EditableField<string>;
	public IsAdministrator: EditableField<boolean>;
	public EnableRemoteAccess: EditableField<boolean>;
	public EnableCollectionManagement: EditableField<boolean>;
	public EnableSubtitleManagement: EditableField<boolean>;
	public EnableAutoLogin: EditableField<boolean>;
}
