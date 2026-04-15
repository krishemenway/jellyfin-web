import { BaseItemDto, DayOfWeek, MetadataField, NameGuidPair, Video3DFormat } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, ObservableArray } from "@residualeffect/reactor";
import { EditableField, IEditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EditablePersonCredit } from "Items/EditablePersonCredit";

export class EditableItem {
	constructor(item: BaseItemDto) {
		this.From = item;

		this.Name = new EditableField("Name", Nullable.Value(item, undefined, (i) => i.Name));
		this.OriginalTitle = new EditableField("LabelOriginalTitle", Nullable.Value(item, undefined, (i) => i.OriginalTitle));
		this.ForcedSortName = new EditableField("LabelSortName", Nullable.Value(item, undefined, (i) => i.ForcedSortName));

		this.Overview = new EditableField("LabelOverview", Nullable.Value(item, undefined, (i) => i.Overview));

		this.CommunityRating = new EditableField("LabelCommunityRating", Nullable.Value(item, undefined, (i) => i.CommunityRating));
		this.CriticRating = new EditableField("LabelCriticRating", Nullable.Value(item, undefined, (i) => i.CriticRating));
		this.OfficialRating = new EditableField("LabelParentalRating", Nullable.Value(item, undefined, (i) => i.OfficialRating));

		this.IndexNumber = new EditableField("IndexNumber", Nullable.Value(item, undefined, (i) => i.IndexNumber));
		this.ParentIndexNumber = new EditableField("ParentIndexNumber", Nullable.Value(item, undefined, (i) => i.ParentIndexNumber));

		this.AirsBeforeSeasonNumber = new EditableField("AirsBeforeSeasonNumber", Nullable.Value(item, undefined, (i) => i.AirsBeforeSeasonNumber));
		this.AirsAfterSeasonNumber = new EditableField("AirsAfterSeasonNumber", Nullable.Value(item, undefined, (i) => i.AirsAfterSeasonNumber));
		this.AirsBeforeEpisodeNumber = new EditableField("AirsBeforeEpisodeNumber", Nullable.Value(item, undefined, (i) => i.AirsBeforeEpisodeNumber));
		this.SeasonName = new EditableField("SeasonName", Nullable.Value(item, undefined, (i) => i.SeasonName));

		this.DisplayOrder = new EditableField("DisplayOrder", Nullable.Value(item, undefined, (i) => i.DisplayOrder));

		this.Album = new EditableField("Album", Nullable.Value(item, undefined, (i) => i.Album));
		this.AlbumArtists = new EditableField("AlbumArtists", Nullable.Value(item, undefined, (i) => i.AlbumArtists));
		this.ArtistItems = new EditableField("ArtistItems", Nullable.Value(item, undefined, (i) => i.ArtistItems));

		this.Status = new EditableField("Status", Nullable.Value(item, undefined, (i) => i.Status));

		this.AirDays = new EditableField("AirDays", Nullable.Value(item, undefined, (i) => i.AirDays));
		this.AirTime = new EditableField("AirTime", Nullable.Value(item, undefined, (i) => i.AirTime));

		this.Tags = new EditableField("Tags", Nullable.Value(item, [], (i) => i.Tags ?? []));
		this.Genres = new EditableField("Genres", Nullable.Value(item, [], (i) => i.Genres ?? []));
		this.People = new ObservableArray(Nullable.Value(item, [], i => (i.People ?? []).map(c => new EditablePersonCredit(c))));

		this.Studios = new EditableField("Studios", Nullable.Value(item, undefined, (i) => i.Studios));
		this.PremiereDate = new EditableField("PremiereDate", Nullable.Value(item, undefined, (i) => i.PremiereDate));
		this.DateCreated = new EditableField("DateCreated", Nullable.Value(item, undefined, (i) => i.DateCreated));
		this.EndDate = new EditableField("EndDate", Nullable.Value(item, undefined, (i) => i.EndDate));
		this.ProductionYear = new EditableField("ProductionYear", Nullable.Value(item, undefined, (i) => i.ProductionYear));
		this.Height = new EditableField("Height", Nullable.Value(item, undefined, (i) => i.Height));
		this.AspectRatio = new EditableField("AspectRatio", Nullable.Value(item, undefined, (i) => i.AspectRatio));
		this.Video3DFormat = new EditableField("Video3DFormat", Nullable.Value(item, undefined, (i) => i.Video3DFormat));
		this.CustomRating = new EditableField("CustomRating", Nullable.Value(item, undefined, (i) => i.CustomRating));
		this.LockData = new EditableField("LockData", Nullable.Value(item, undefined, (i) => i.LockData));
		this.LockedFields = new EditableField("LockedFields", Nullable.Value(item, undefined, (i) => i.LockedFields));
		this.ProviderIds = new EditableField("ProviderIds", Nullable.Value(item, undefined, (i) => i.ProviderIds));
		this.PreferredMetadataLanguage = new EditableField("PreferredMetadataLanguage", Nullable.Value(item, undefined, (i) => i.PreferredMetadataLanguage));
		this.PreferredMetadataCountryCode = new EditableField("PreferredMetadataCountryCode", Nullable.Value(item, undefined, (i) => i.PreferredMetadataCountryCode));
		this.Taglines = new EditableField("Taglines", Nullable.Value(item, undefined, (i) => i.Taglines));

		this.CanMakeRequest = new Computed(() => this.AllFields().some((f) => f.CanMakeRequest()));
		this.HasChanged = new Computed(() => this.AllFields().some((f) => f.HasChanged.Value));
	}

	public Revert(): void {
		this.AllFields().forEach((field) => field.Revert());
	}

	public OnSaved(): void {
		this.AllFields().forEach((field) => field.OnSaved());
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
			People: this.People.Value.map((pc) => pc.CreateRequest()),
			LockData: this.LockData.Current.Value,
			LockedFields: this.LockedFields.Current.Value,
			ProviderIds: this.ProviderIds.Current.Value,
			PreferredMetadataLanguage: this.PreferredMetadataLanguage.Current.Value,
			PreferredMetadataCountryCode: this.PreferredMetadataCountryCode.Current.Value,
			Taglines: this.Taglines.Current.Value,
			SeasonName: this.SeasonName.Current.Value,
		};
	}

	private AllFields(): IEditableField[] {
		const allFields = [
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
			this.LockData,
			this.LockedFields,
			this.ProviderIds,
			this.PreferredMetadataLanguage,
			this.PreferredMetadataCountryCode,
			this.Taglines,
			this.SeasonName,
		] as IEditableField[];

		this.People.Value.forEach((pc) => allFields.push(...pc.AllFields()));

		return allFields;
	}

	public HasChanged: Computed<boolean>;
	public CanMakeRequest: Computed<boolean>;

	public From: BaseItemDto;

	public Name: EditableField;
	public OriginalTitle: EditableField;
	public ForcedSortName: EditableField;

	public Overview: EditableField;
	public Taglines: EditableField<string[]|undefined|null>;

	public CommunityRating: EditableField<number|undefined|null>;
	public CriticRating: EditableField<number|undefined|null>;
	public OfficialRating: EditableField;
	public CustomRating: EditableField;

	public IndexNumber: EditableField<number|undefined|null>;
	public ParentIndexNumber: EditableField<number|undefined|null>;

	public AirsBeforeSeasonNumber: EditableField<number|undefined|null>;
	public AirsAfterSeasonNumber: EditableField<number|undefined|null>;
	public AirsBeforeEpisodeNumber: EditableField<number|undefined|null>;
	public SeasonName: EditableField;
	public DisplayOrder: EditableField;

	public Album: EditableField;
	public AlbumArtists: EditableField<NameGuidPair[]|undefined|null>;
	public ArtistItems: EditableField<NameGuidPair[]|undefined|null>;

	public Studios: EditableField<NameGuidPair[]|undefined|null>;

	public Status: EditableField;

	public AirDays: EditableField<DayOfWeek[]|undefined|null>;
	public AirTime: EditableField;

	public Genres: EditableField<string[]>;
	public Tags: EditableField<string[]>;

	public PremiereDate: EditableField;
	public ProductionYear: EditableField<number|undefined|null>;

	public DateCreated: EditableField;
	public EndDate: EditableField;

	public Height: EditableField<number|undefined|null>;
	public AspectRatio: EditableField;
	public Video3DFormat: EditableField<Video3DFormat|undefined>;

	public People: ObservableArray<EditablePersonCredit>;

	public LockData: EditableField<boolean|undefined|null>;
	public LockedFields: EditableField<MetadataField[]|undefined|null>;

	public ProviderIds: EditableField<Record<string, string|null>|undefined|null>;

	public PreferredMetadataLanguage: EditableField;
	public PreferredMetadataCountryCode: EditableField;
}
