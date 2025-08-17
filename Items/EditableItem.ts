import { BaseItemDto, BaseItemPerson, DayOfWeek, MetadataField, NameGuidPair, Video3DFormat } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed } from "@residualeffect/reactor";
import { EditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class EditableItem {
	constructor(item: BaseItemDto) {
		this.From = item;

		this.Name = new EditableField("Name", Nullable.Value(item, "", (i) => i.Name ?? ""));
		this.OriginalTitle = new EditableField("LabelOriginalTitle", Nullable.Value(item, "", (i) => i.OriginalTitle ?? ""));
		this.ForcedSortName = new EditableField("LabelSortName", Nullable.Value(item, "", (i) => i.ForcedSortName ?? ""));

		this.Overview = new EditableField("LabelOverview", Nullable.Value(item, "", (i) => i.Overview ?? ""));

		this.CommunityRating = new EditableField("LabelCommunityRating", Nullable.Value(item, undefined, (i) => i.CommunityRating ?? undefined));
		this.CriticRating = new EditableField("LabelCriticRating", Nullable.Value(item, undefined, (i) => i.CriticRating ?? undefined));
		this.OfficialRating = new EditableField("LabelParentalRating", Nullable.Value(item, undefined, (i) => i.OfficialRating ?? undefined));

		this.IndexNumber = new EditableField("IndexNumber", Nullable.Value(item, undefined, (i) => i.IndexNumber ?? undefined));
		this.ParentIndexNumber = new EditableField("ParentIndexNumber", Nullable.Value(item, undefined, (i) => i.ParentIndexNumber ?? undefined));

		this.AirsBeforeSeasonNumber = new EditableField("AirsBeforeSeasonNumber", Nullable.Value(item, undefined, (i) => i.AirsBeforeSeasonNumber ?? undefined));
		this.AirsAfterSeasonNumber = new EditableField("AirsAfterSeasonNumber", Nullable.Value(item, undefined, (i) => i.AirsAfterSeasonNumber ?? undefined));
		this.AirsBeforeEpisodeNumber = new EditableField("AirsBeforeEpisodeNumber", Nullable.Value(item, undefined, (i) => i.AirsBeforeEpisodeNumber ?? undefined));

		this.DisplayOrder = new EditableField("DisplayOrder", Nullable.Value(item, undefined, (i) => i.DisplayOrder ?? undefined));

		this.Album = new EditableField("Album", Nullable.Value(item, undefined, (i) => i.Album ?? undefined));
		this.AlbumArtists = new EditableField("AlbumArtists", Nullable.Value(item, undefined, (i) => i.AlbumArtists ?? undefined));
		this.ArtistItems = new EditableField("ArtistItems", Nullable.Value(item, undefined, (i) => i.ArtistItems ?? undefined));

		this.Status = new EditableField("Status", Nullable.Value(item, undefined, (i) => i.Status ?? undefined));

		this.AirDays = new EditableField("AirDays", Nullable.Value(item, undefined, (i) => i.AirDays ?? undefined));
		this.AirTime = new EditableField("AirTime", Nullable.Value(item, undefined, (i) => i.AirTime ?? undefined));

		this.Tags = new EditableField("Tags", Nullable.Value(item, undefined, (i) => i.Tags ?? undefined));
		this.Genres = new EditableField("Genres", Nullable.Value(item, undefined, (i) => i.Genres ?? undefined));

		this.Studios = new EditableField("Studios", Nullable.Value(item, undefined, (i) => i.Studios ?? undefined));
		this.PremiereDate = new EditableField("PremiereDate", Nullable.Value(item, undefined, (i) => i.PremiereDate ?? undefined));
		this.DateCreated = new EditableField("DateCreated", Nullable.Value(item, undefined, (i) => i.DateCreated ?? undefined));
		this.EndDate = new EditableField("EndDate", Nullable.Value(item, undefined, (i) => i.EndDate ?? undefined));
		this.ProductionYear = new EditableField("ProductionYear", Nullable.Value(item, undefined, (i) => i.ProductionYear ?? undefined));
		this.Height = new EditableField("Height", Nullable.Value(item, undefined, (i) => i.Height ?? undefined));
		this.AspectRatio = new EditableField("AspectRatio", Nullable.Value(item, undefined, (i) => i.AspectRatio ?? undefined));
		this.Video3DFormat = new EditableField("Video3DFormat", Nullable.Value(item, undefined, (i) => i.Video3DFormat ?? undefined));
		this.CustomRating = new EditableField("CustomRating", Nullable.Value(item, undefined, (i) => i.CustomRating ?? undefined));
		this.People = new EditableField("People", Nullable.Value(item, undefined, (i) => i.People ?? undefined));
		this.LockData = new EditableField("LockData", Nullable.Value(item, undefined, (i) => i.LockData ?? undefined));
		this.LockedFields = new EditableField("LockedFields", Nullable.Value(item, undefined, (i) => i.LockedFields ?? undefined));
		this.ProviderIds = new EditableField("ProviderIds", Nullable.Value(item, undefined, (i) => i.ProviderIds ?? undefined));
		this.PreferredMetadataLanguage = new EditableField("PreferredMetadataLanguage", Nullable.Value(item, undefined, (i) => i.PreferredMetadataLanguage ?? undefined));
		this.PreferredMetadataCountryCode = new EditableField("PreferredMetadataCountryCode", Nullable.Value(item, undefined, (i) => i.PreferredMetadataCountryCode ?? undefined));
		this.Taglines = new EditableField("Taglines", Nullable.Value(item, undefined, (i) => i.Taglines ?? undefined));

		this.CanMakeRequest = new Computed(() => this.AllFields().some((f) => f.CanMakeRequest()));
		this.HasChanged = new Computed(() => this.AllFields().some((f) => f.HasChanged.Value));
	}

	public CreateUpdateRequest(): BaseItemDto {
		return {
			Name: this.Name.Current.Value,
			OriginalTitle: this.OriginalTitle.Current.Value,
			ForcedSortName: this.ForcedSortName.Current.Value,
			Overview: this.Overview.Current.Value,
			CommunityRating: this.CommunityRating.Current.Value,
			CriticRating: this.CriticRating.Current.Value,
			OfficialRating: this.OfficialRating.Current.Value,
			IndexNumber: this.IndexNumber.Current.Value,
			ParentIndexNumber: this.ParentIndexNumber.Current.Value,
			AirsBeforeSeasonNumber: this.AirsBeforeSeasonNumber.Current.Value,
			AirsAfterSeasonNumber: this.AirsAfterSeasonNumber.Current.Value,
			AirsBeforeEpisodeNumber: this.AirsBeforeEpisodeNumber.Current.Value,
			DisplayOrder: this.DisplayOrder.Current.Value,
			Album: this.Album.Current.Value,
			AlbumArtists: this.AlbumArtists.Current.Value,
			ArtistItems: this.ArtistItems.Current.Value,
			Status: this.Status.Current.Value,
			AirDays: this.AirDays.Current.Value,
			AirTime: this.AirTime.Current.Value,
			Genres: this.Genres.Current.Value,
			Tags: this.Tags.Current.Value,
			Studios: this.Studios.Current.Value,
			PremiereDate: this.PremiereDate.Current.Value,
			DateCreated: this.DateCreated.Current.Value,
			EndDate: this.EndDate.Current.Value,
			ProductionYear: this.ProductionYear.Current.Value,
			Height: this.Height.Current.Value,
			AspectRatio: this.AspectRatio.Current.Value,
			Video3DFormat: this.Video3DFormat.Current.Value,
			CustomRating: this.CustomRating.Current.Value,
			People: this.People.Current.Value,
			LockData: this.LockData.Current.Value,
			LockedFields: this.LockedFields.Current.Value,
			ProviderIds: this.ProviderIds.Current.Value,
			PreferredMetadataLanguage: this.PreferredMetadataLanguage.Current.Value,
			PreferredMetadataCountryCode: this.PreferredMetadataCountryCode.Current.Value,
			Taglines: this.Taglines.Current.Value,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private AllFields(): EditableField<any>[] {
		return [
			this.Name,
			this.OriginalTitle,
			this.ForcedSortName,
			this.Overview,
			this.CommunityRating,
			this.CriticRating,
			this.OfficialRating,
			this.IndexNumber,
			this.ParentIndexNumber,
			this.AirsBeforeSeasonNumber,
			this.AirsAfterSeasonNumber,
			this.AirsBeforeEpisodeNumber,
			this.DisplayOrder,
			this.Album,
			this.AlbumArtists,
			this.ArtistItems,
			this.Status,
			this.AirDays,
			this.AirTime,
			this.Genres,
			this.Tags,
			this.Studios,
			this.PremiereDate,
			this.DateCreated,
			this.EndDate,
			this.ProductionYear,
			this.Height,
			this.AspectRatio,
			this.Video3DFormat,
			this.CustomRating,
			this.People,
			this.LockData,
			this.LockedFields,
			this.ProviderIds,
			this.PreferredMetadataLanguage,
			this.PreferredMetadataCountryCode,
			this.Taglines,
		];
	}

	public HasChanged: Computed<boolean>;
	public CanMakeRequest: Computed<boolean>;

	public From: BaseItemDto;

	public Name: EditableField;
	public OriginalTitle: EditableField;
	public ForcedSortName: EditableField;

	public Overview: EditableField;
	public Taglines: EditableField<string[]|undefined>;

	public CommunityRating: EditableField<number|undefined>;
	public CriticRating: EditableField<number|undefined>;
	public OfficialRating: EditableField<string|undefined>;
	public CustomRating: EditableField<string|undefined>;

	public IndexNumber: EditableField<number|undefined>;
	public ParentIndexNumber: EditableField<number|undefined>;

	public AirsBeforeSeasonNumber: EditableField<number|undefined>;
	public AirsAfterSeasonNumber: EditableField<number|undefined>;
	public AirsBeforeEpisodeNumber: EditableField<number|undefined>;
	public DisplayOrder: EditableField<string|undefined>;

	public Album: EditableField<string|undefined>;
	public AlbumArtists: EditableField<NameGuidPair[]|undefined>;
	public ArtistItems: EditableField<NameGuidPair[]|undefined>;

	public Studios: EditableField<NameGuidPair[]|undefined>;

	public Status: EditableField<string|undefined>;

	public AirDays: EditableField<DayOfWeek[]|undefined>;
	public AirTime: EditableField<string|undefined>;

	public Genres: EditableField<string[]|undefined>;
	public Tags: EditableField<string[]|undefined>;

	public PremiereDate: EditableField<string|undefined>;
	public ProductionYear: EditableField<number|undefined>;

	public DateCreated: EditableField<string|undefined>;
	public EndDate: EditableField<string|undefined>;

	public Height: EditableField<number|undefined>;
	public AspectRatio: EditableField<string|undefined>;
	public Video3DFormat: EditableField<Video3DFormat|undefined>;

	public People: EditableField<BaseItemPerson[]|undefined>;

	public LockData: EditableField<boolean|undefined>;
	public LockedFields: EditableField<MetadataField[]|undefined>;

	public ProviderIds: EditableField<Record<string, string|null>|undefined>;

	public PreferredMetadataLanguage: EditableField<string|undefined>;
	public PreferredMetadataCountryCode: EditableField<string|undefined>;
}
