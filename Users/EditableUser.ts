import { AccessSchedule, SyncPlayUserAccessType, UnratedItem, UserDto } from "@jellyfin/sdk/lib/generated-client";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";

export class EditableUser {
	constructor(user: UserDto) {
		this.From = user;

		this.Name = new EditableField<string>("Name", user.Name ?? "", ValueIsRequired);
		this.EnableAutoLogin = new EditableField<boolean>("EnableAutoLogin", user.EnableAutoLogin ?? false);

		this.IsAdministrator = new EditableField<boolean>("IsAdministrator", user.Policy?.IsAdministrator ?? false);
		this.IsHidden = new EditableField<boolean>("IsHidden", user.Policy?.IsHidden ?? false);
		this.EnableCollectionManagement = new EditableField<boolean>("EnableCollectionManagement", user.Policy?.EnableCollectionManagement ?? false);
		this.EnableSubtitleManagement = new EditableField<boolean>("EnableSubtitleManagement", user.Policy?.EnableSubtitleManagement ?? false);
		this.EnableLyricManagement = new EditableField<boolean>("EnableLyricManagement", user.Policy?.EnableLyricManagement ?? false);
		this.IsDisabled = new EditableField<boolean>("IsDisabled", user.Policy?.IsDisabled ?? false);
		this.MaxParentalRating = new EditableField<number | null>("MaxParentalRating", user.Policy?.MaxParentalRating ?? null);
		this.MaxParentalSubRating = new EditableField<number | null>("MaxParentalSubRating", user.Policy?.MaxParentalSubRating ?? null);
		this.BlockedTags = new EditableField<string[]>("BlockedTags", user.Policy?.BlockedTags ?? []);
		this.AllowedTags = new EditableField<string[]>("AllowedTags", user.Policy?.AllowedTags ?? []);
		this.EnableUserPreferenceAccess = new EditableField<boolean>("EnableUserPreferenceAccess", user.Policy?.EnableUserPreferenceAccess ?? false);
		this.AccessSchedules = new EditableField<Array<AccessSchedule> | null>("AccessSchedules", user.Policy?.AccessSchedules ?? null);
		this.BlockUnratedItems = new EditableField<UnratedItem[]>("BlockUnratedItems", user.Policy?.BlockUnratedItems ?? []);
		this.EnableRemoteControlOfOtherUsers = new EditableField<boolean>("EnableRemoteControlOfOtherUsers", user.Policy?.EnableRemoteControlOfOtherUsers ?? false);
		this.EnableSharedDeviceControl = new EditableField<boolean>("EnableSharedDeviceControl", user.Policy?.EnableSharedDeviceControl ?? false);
		this.EnableRemoteAccess = new EditableField<boolean>("EnableRemoteAccess", user.Policy?.EnableRemoteAccess ?? false);
		this.EnableLiveTvManagement = new EditableField<boolean>("EnableLiveTvManagement", user.Policy?.EnableLiveTvManagement ?? false);
		this.EnableLiveTvAccess = new EditableField<boolean>("EnableLiveTvAccess", user.Policy?.EnableLiveTvAccess ?? false);
		this.EnableMediaPlayback = new EditableField<boolean>("EnableMediaPlayback", user.Policy?.EnableMediaPlayback ?? false);
		this.EnableAudioPlaybackTranscoding = new EditableField<boolean>("EnableAudioPlaybackTranscoding", user.Policy?.EnableAudioPlaybackTranscoding ?? false);
		this.EnableVideoPlaybackTranscoding = new EditableField<boolean>("EnableVideoPlaybackTranscoding", user.Policy?.EnableVideoPlaybackTranscoding ?? false);
		this.EnablePlaybackRemuxing = new EditableField<boolean>("EnablePlaybackRemuxing", user.Policy?.EnablePlaybackRemuxing ?? false);
		this.ForceRemoteSourceTranscoding = new EditableField<boolean>("ForceRemoteSourceTranscoding", user.Policy?.ForceRemoteSourceTranscoding ?? false);
		this.EnableContentDeletion = new EditableField<boolean>("EnableContentDeletion", user.Policy?.EnableContentDeletion ?? false);
		this.EnableContentDeletionFromFolders = new EditableField<string[]>("EnableContentDeletionFromFolders", user.Policy?.EnableContentDeletionFromFolders ?? []);
		this.EnableContentDownloading = new EditableField<boolean>("EnableContentDownloading", user.Policy?.EnableContentDownloading ?? false);
		this.EnableSyncTranscoding = new EditableField<boolean>("EnableSyncTranscoding", user.Policy?.EnableSyncTranscoding ?? false);
		this.EnableMediaConversion = new EditableField<boolean>("EnableMediaConversion", user.Policy?.EnableMediaConversion ?? false);
		this.EnabledDevices = new EditableField<string[]>("EnabledDevices", user.Policy?.EnabledDevices ?? []);
		this.EnableAllDevices = new EditableField<boolean>("EnableAllDevices", user.Policy?.EnableAllDevices ?? false);
		this.EnabledChannels = new EditableField<string[]>("EnabledChannels", user.Policy?.EnabledChannels ?? []);
		this.EnableAllChannels = new EditableField<boolean>("EnableAllChannels", user.Policy?.EnableAllChannels ?? false);
		this.EnabledFolders = new EditableField<string[]>("EnabledFolders", user.Policy?.EnabledFolders ?? []);
		this.EnableAllFolders = new EditableField<boolean>("EnableAllFolders", user.Policy?.EnableAllFolders ?? false);
		this.InvalidLoginAttemptCount = new EditableField<number | undefined>("InvalidLoginAttemptCount", user.Policy?.InvalidLoginAttemptCount ?? -1);
		this.LoginAttemptsBeforeLockout = new EditableField<number | undefined>("LoginAttemptsBeforeLockout", user.Policy?.LoginAttemptsBeforeLockout ?? -1);
		this.MaxActiveSessions = new EditableField<number | undefined>("MaxActiveSessions", user.Policy?.MaxActiveSessions ?? 0);
		this.EnablePublicSharing = new EditableField<boolean>("EnablePublicSharing", user.Policy?.EnablePublicSharing ?? false);
		this.BlockedMediaFolders = new EditableField<string[]>("BlockedMediaFolders", user.Policy?.BlockedMediaFolders ?? []);
		this.BlockedChannels = new EditableField<string[]>("BlockedChannels", user.Policy?.BlockedChannels ?? []);
		this.RemoteClientBitrateLimit = new EditableField<number | undefined>("RemoteClientBitrateLimit", user.Policy?.RemoteClientBitrateLimit ?? 0);
		this.AuthenticationProviderId = new EditableField<string | undefined>("AuthenticationProviderId", user.Policy?.AuthenticationProviderId);
		this.PasswordResetProviderId = new EditableField<string | undefined>("PasswordResetProviderId", user.Policy?.PasswordResetProviderId);
		this.SyncPlayAccess = new EditableField<SyncPlayUserAccessType>("SyncPlayAccess", user.Policy?.SyncPlayAccess ?? "CreateAndJoinGroups");

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
				IsHidden: this.IsHidden.Current.Value,
				EnableCollectionManagement: this.EnableCollectionManagement.Current.Value,
				EnableSubtitleManagement: this.EnableSubtitleManagement.Current.Value,
				EnableLyricManagement: this.EnableLyricManagement.Current.Value,
				IsDisabled: this.IsDisabled.Current.Value,
				MaxParentalRating: this.MaxParentalRating.Current.Value,
				MaxParentalSubRating: this.MaxParentalSubRating.Current.Value,
				BlockedTags: this.BlockedTags.Current.Value,
				AllowedTags: this.AllowedTags.Current.Value,
				EnableUserPreferenceAccess: this.EnableUserPreferenceAccess.Current.Value,
				AccessSchedules: this.AccessSchedules.Current.Value,
				BlockUnratedItems: this.BlockUnratedItems.Current.Value,
				EnableRemoteControlOfOtherUsers: this.EnableRemoteControlOfOtherUsers.Current.Value,
				EnableSharedDeviceControl: this.EnableSharedDeviceControl.Current.Value,
				EnableRemoteAccess: this.EnableRemoteAccess.Current.Value,
				EnableLiveTvManagement: this.EnableLiveTvManagement.Current.Value,
				EnableLiveTvAccess: this.EnableLiveTvAccess.Current.Value,
				EnableMediaPlayback: this.EnableMediaPlayback.Current.Value,
				EnableAudioPlaybackTranscoding: this.EnableAudioPlaybackTranscoding.Current.Value,
				EnableVideoPlaybackTranscoding: this.EnableVideoPlaybackTranscoding.Current.Value,
				EnablePlaybackRemuxing: this.EnablePlaybackRemuxing.Current.Value,
				ForceRemoteSourceTranscoding: this.ForceRemoteSourceTranscoding.Current.Value,
				EnableContentDeletion: this.EnableContentDeletion.Current.Value,
				EnableContentDeletionFromFolders: this.EnableContentDeletionFromFolders.Current.Value,
				EnableContentDownloading: this.EnableContentDownloading.Current.Value,
				EnableSyncTranscoding: this.EnableSyncTranscoding.Current.Value,
				EnableMediaConversion: this.EnableMediaConversion.Current.Value,
				EnabledDevices: this.EnabledDevices.Current.Value,
				EnableAllDevices: this.EnableAllDevices.Current.Value,
				EnabledChannels: this.EnabledChannels.Current.Value,
				EnableAllChannels: this.EnableAllChannels.Current.Value,
				EnabledFolders: this.EnabledFolders.Current.Value,
				EnableAllFolders: this.EnableAllFolders.Current.Value,
				InvalidLoginAttemptCount: this.InvalidLoginAttemptCount.Current.Value,
				LoginAttemptsBeforeLockout: this.LoginAttemptsBeforeLockout.Current.Value,
				MaxActiveSessions: this.MaxActiveSessions.Current.Value,
				EnablePublicSharing: this.EnablePublicSharing.Current.Value,
				BlockedMediaFolders: this.BlockedMediaFolders.Current.Value,
				BlockedChannels: this.BlockedChannels.Current.Value,
				RemoteClientBitrateLimit: this.RemoteClientBitrateLimit.Current.Value,
				AuthenticationProviderId: this.AuthenticationProviderId.Current.Value ?? "",
				PasswordResetProviderId: this.PasswordResetProviderId.Current.Value ?? "",
				SyncPlayAccess: this.SyncPlayAccess.Current.Value,
			},
		};
	}

	private AllFields(): IEditableField[] {
		return [
			this.Name,
			this.IsAdministrator,
			this.IsHidden,
			this.EnableCollectionManagement,
			this.EnableSubtitleManagement,
			this.EnableLyricManagement,
			this.IsDisabled,
			this.MaxParentalRating,
			this.MaxParentalSubRating,
			this.BlockedTags,
			this.AllowedTags,
			this.EnableUserPreferenceAccess,
			this.AccessSchedules,
			this.BlockUnratedItems,
			this.EnableRemoteControlOfOtherUsers,
			this.EnableSharedDeviceControl,
			this.EnableRemoteAccess,
			this.EnableLiveTvManagement,
			this.EnableLiveTvAccess,
			this.EnableMediaPlayback,
			this.EnableAudioPlaybackTranscoding,
			this.EnableVideoPlaybackTranscoding,
			this.EnablePlaybackRemuxing,
			this.ForceRemoteSourceTranscoding,
			this.EnableContentDeletion,
			this.EnableContentDeletionFromFolders,
			this.EnableContentDownloading,
			this.EnableSyncTranscoding,
			this.EnableMediaConversion,
			this.EnabledDevices,
			this.EnableAllDevices,
			this.EnabledChannels,
			this.EnableAllChannels,
			this.EnabledFolders,
			this.EnabledFolders,
			this.InvalidLoginAttemptCount,
			this.LoginAttemptsBeforeLockout,
			this.MaxActiveSessions,
			this.EnablePublicSharing,
			this.BlockedMediaFolders,
			this.BlockedChannels,
			this.RemoteClientBitrateLimit,
			this.AuthenticationProviderId,
			this.PasswordResetProviderId,
			this.SyncPlayAccess,
		];
	}

	public HasChanged: Computed<boolean>;
	public CanMakeRequest: Computed<boolean>;

	public From: UserDto;

	public Name: EditableField<string>;
	public EnableAutoLogin: EditableField<boolean>;

	public IsAdministrator: EditableField<boolean>;
	public IsHidden: EditableField<boolean>;
	public EnableCollectionManagement: EditableField<boolean>;
	public EnableSubtitleManagement: EditableField<boolean>;
	public EnableLyricManagement: EditableField<boolean>;
	public IsDisabled: EditableField<boolean>;
	public MaxParentalRating: EditableField<number | null>;
	public MaxParentalSubRating: EditableField<number | null>;
	public BlockedTags: EditableField<string[]>;
	public AllowedTags: EditableField<string[]>;
	public EnableUserPreferenceAccess: EditableField<boolean>;
	public AccessSchedules: EditableField<Array<AccessSchedule> | null>;
	public BlockUnratedItems: EditableField<UnratedItem[]>;
	public EnableRemoteControlOfOtherUsers: EditableField<boolean>;
	public EnableSharedDeviceControl: EditableField<boolean>;
	public EnableRemoteAccess: EditableField<boolean>;
	public EnableLiveTvManagement: EditableField<boolean>;
	public EnableLiveTvAccess: EditableField<boolean>;
	public EnableMediaPlayback: EditableField<boolean>;
	public EnableAudioPlaybackTranscoding: EditableField<boolean>;
	public EnableVideoPlaybackTranscoding: EditableField<boolean>;
	public EnablePlaybackRemuxing: EditableField<boolean>;
	public ForceRemoteSourceTranscoding: EditableField<boolean>;
	public EnableContentDeletion: EditableField<boolean>;
	public EnableContentDeletionFromFolders: EditableField<string[]>;
	public EnableContentDownloading: EditableField<boolean>;
	public EnableSyncTranscoding: EditableField<boolean>;
	public EnableMediaConversion: EditableField<boolean>;
	public EnabledDevices: EditableField<string[]>;
	public EnableAllDevices: EditableField<boolean>;
	public EnabledChannels: EditableField<string[]>;
	public EnableAllChannels: EditableField<boolean>;
	public EnabledFolders: EditableField<string[]>;
	public EnableAllFolders: EditableField<boolean>;
	public InvalidLoginAttemptCount: EditableField<number | undefined>;
	public LoginAttemptsBeforeLockout: EditableField<number | undefined>;
	public MaxActiveSessions: EditableField<number | undefined>;
	public EnablePublicSharing: EditableField<boolean>;
	public BlockedMediaFolders: EditableField<string[]>;
	public BlockedChannels: EditableField<string[]>;
	public RemoteClientBitrateLimit: EditableField<number | undefined>;
	public AuthenticationProviderId: EditableField<string | undefined>;
	public PasswordResetProviderId: EditableField<string | undefined>;
	public SyncPlayAccess: EditableField<SyncPlayUserAccessType>;
}
