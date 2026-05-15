import { EditableField, IEditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { EmbeddedSubtitleOptions, LibraryOptions, LibraryOptionsResultDto, VirtualFolderInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed } from "@residualeffect/reactor";
import { EditableLibraryItemTypeOptions } from "Servers/EditableLibraryItemTypeOptions";

export class EditableLibrary {
	constructor(libraryOptions: LibraryOptionsResultDto, virtualFolderInfo?: VirtualFolderInfo) {
		this.Existing = virtualFolderInfo;
		this.LibraryOptions = libraryOptions;
		this.IsNew = !Nullable.HasValue(virtualFolderInfo);

		this.TypeOptions = (libraryOptions.TypeOptions ?? []).map((typeOption) => new EditableLibraryItemTypeOptions(typeOption, this.Existing?.LibraryOptions?.TypeOptions))

		this.Locations = new EditableField("Locations", this.Existing?.Locations ?? []);
		this.Enabled = new EditableField("Enabled", this.Existing?.LibraryOptions?.Enabled ?? false);
		this.EnablePhotos = new EditableField("EnablePhotos", this.Existing?.LibraryOptions?.EnablePhotos ?? false);
		this.EnableRealtimeMonitor = new EditableField("EnableRealtimeMonitor", this.Existing?.LibraryOptions?.EnableRealtimeMonitor ?? false);
		this.EnableLUFSScan = new EditableField("EnableLUFSScan", this.Existing?.LibraryOptions?.EnableLUFSScan ?? false);
		this.EnableChapterImageExtraction = new EditableField("EnableChapterImageExtraction", this.Existing?.LibraryOptions?.EnableChapterImageExtraction ?? false);
		this.ExtractChapterImagesDuringLibraryScan = new EditableField("ExtractChapterImagesDuringLibraryScan", this.Existing?.LibraryOptions?.ExtractChapterImagesDuringLibraryScan ?? false);
		this.EnableTrickplayImageExtraction = new EditableField("EnableTrickplayImageExtraction", this.Existing?.LibraryOptions?.EnableTrickplayImageExtraction ?? false);
		this.ExtractTrickplayImagesDuringLibraryScan = new EditableField("ExtractTrickplayImagesDuringLibraryScan", this.Existing?.LibraryOptions?.ExtractTrickplayImagesDuringLibraryScan ?? false);
		this.SaveLocalMetadata = new EditableField("SaveLocalMetadata", this.Existing?.LibraryOptions?.SaveLocalMetadata ?? false);
		this.EnableAutomaticSeriesGrouping = new EditableField("EnableAutomaticSeriesGrouping", this.Existing?.LibraryOptions?.EnableAutomaticSeriesGrouping ?? false);
		this.EnableEmbeddedTitles = new EditableField("EnableEmbeddedTitles", this.Existing?.LibraryOptions?.EnableEmbeddedTitles ?? false);
		this.EnableEmbeddedExtrasTitles = new EditableField("EnableEmbeddedExtrasTitles", this.Existing?.LibraryOptions?.EnableEmbeddedExtrasTitles ?? false);
		this.EnableEmbeddedEpisodeInfos = new EditableField("EnableEmbeddedEpisodeInfos", this.Existing?.LibraryOptions?.EnableEmbeddedEpisodeInfos ?? false);
		this.AutomaticRefreshIntervalDays = new EditableField("AutomaticRefreshIntervalDays", this.Existing?.LibraryOptions?.AutomaticRefreshIntervalDays ?? 0);
		this.PreferredMetadataLanguage = new EditableField("PreferredMetadataLanguage", this.Existing?.LibraryOptions?.PreferredMetadataLanguage ?? "");
		this.MetadataCountryCode = new EditableField("MetadataCountryCode", this.Existing?.LibraryOptions?.MetadataCountryCode ?? "");
		this.SeasonZeroDisplayName = new EditableField("SeasonZeroDisplayName", this.Existing?.LibraryOptions?.SeasonZeroDisplayName ?? "Specials");
		this.MetadataSavers = new EditableField("MetadataSavers", this.Existing?.LibraryOptions?.MetadataSavers ?? []);
		this.DisabledLocalMetadataReaders = new EditableField("DisabledLocalMetadataReaders", this.Existing?.LibraryOptions?.DisabledLocalMetadataReaders ?? []);
		this.LocalMetadataReaderOrder = new EditableField("LocalMetadataReaderOrder", this.Existing?.LibraryOptions?.LocalMetadataReaderOrder ?? []);
		this.DisabledSubtitleFetchers = new EditableField("DisabledSubtitleFetchers", this.Existing?.LibraryOptions?.DisabledSubtitleFetchers ?? []);
		this.SubtitleFetcherOrder = new EditableField("SubtitleFetcherOrder", this.Existing?.LibraryOptions?.SubtitleFetcherOrder ?? []);
		this.DisabledMediaSegmentProviders = new EditableField("DisabledMediaSegmentProviders", this.Existing?.LibraryOptions?.DisabledMediaSegmentProviders ?? []);
		this.MediaSegmentProviderOrder = new EditableField("MediaSegmentProviderOrder", this.Existing?.LibraryOptions?.MediaSegmentProviderOrder ?? []);
		this.SkipSubtitlesIfEmbeddedSubtitlesPresent = new EditableField("SkipSubtitlesIfEmbeddedSubtitlesPresent", this.Existing?.LibraryOptions?.SkipSubtitlesIfEmbeddedSubtitlesPresent ?? false);
		this.SkipSubtitlesIfAudioTrackMatches = new EditableField("SkipSubtitlesIfAudioTrackMatches", this.Existing?.LibraryOptions?.SkipSubtitlesIfAudioTrackMatches ?? false);
		this.SubtitleDownloadLanguages = new EditableField("SubtitleDownloadLanguages", this.Existing?.LibraryOptions?.SubtitleDownloadLanguages ?? []);
		this.RequirePerfectSubtitleMatch = new EditableField("RequirePerfectSubtitleMatch", this.Existing?.LibraryOptions?.RequirePerfectSubtitleMatch ?? false);
		this.SaveSubtitlesWithMedia = new EditableField("SaveSubtitlesWithMedia", this.Existing?.LibraryOptions?.SaveSubtitlesWithMedia ?? false);
		this.SaveLyricsWithMedia = new EditableField("SaveLyricsWithMedia", this.Existing?.LibraryOptions?.SaveLyricsWithMedia ?? false);
		this.SaveTrickplayWithMedia = new EditableField("SaveTrickplayWithMedia", this.Existing?.LibraryOptions?.SaveTrickplayWithMedia ?? false);
		this.DisabledLyricFetchers = new EditableField("DisabledLyricFetchers", this.Existing?.LibraryOptions?.DisabledLyricFetchers ?? []);
		this.LyricFetcherOrder = new EditableField("LyricFetcherOrder", this.Existing?.LibraryOptions?.LyricFetcherOrder ?? []);
		this.PreferNonstandardArtistsTag = new EditableField("PreferNonstandardArtistsTag", this.Existing?.LibraryOptions?.PreferNonstandardArtistsTag ?? false);
		this.UseCustomTagDelimiters = new EditableField("UseCustomTagDelimiters", this.Existing?.LibraryOptions?.UseCustomTagDelimiters ?? false);
		this.CustomTagDelimiters = new EditableField("CustomTagDelimiters", this.Existing?.LibraryOptions?.CustomTagDelimiters ?? []);
		this.DelimiterWhitelist = new EditableField("DelimiterWhitelist", this.Existing?.LibraryOptions?.DelimiterWhitelist ?? []);
		this.AutomaticallyAddToCollection = new EditableField("AutomaticallyAddToCollection", this.Existing?.LibraryOptions?.AutomaticallyAddToCollection ?? false);
		this.AllowEmbeddedSubtitles = new EditableField("AllowEmbeddedSubtitles", this.Existing?.LibraryOptions?.AllowEmbeddedSubtitles ?? "AllowAll");

		this.CanMakeRequest = new Computed(() => this.AllFields().every((f) => f.CanMakeRequest()));
		this.HasChanged = new Computed(() => this.AllFields().some((f) => f.HasChanged.Value));
	}

	public Revert(): void {
		this.AllFields().forEach((field) => field.Revert());
	}

	public OnSaved(): void {
		this.AllFields().forEach((field) => field.OnSaved());
	}

	public CreateUpdateRequest(): LibraryOptions {
		return {
			Enabled: this.Enabled.Current.Value,
			EnablePhotos: this.EnablePhotos.Current.Value,
			EnableRealtimeMonitor: this.EnableRealtimeMonitor.Current.Value,
			EnableLUFSScan: this.EnableLUFSScan.Current.Value,
			EnableChapterImageExtraction: this.EnableChapterImageExtraction.Current.Value,
			ExtractChapterImagesDuringLibraryScan: this.ExtractChapterImagesDuringLibraryScan.Current.Value,
			EnableTrickplayImageExtraction: this.EnableTrickplayImageExtraction.Current.Value,
			ExtractTrickplayImagesDuringLibraryScan: this.ExtractTrickplayImagesDuringLibraryScan.Current.Value,
			SaveLocalMetadata: this.SaveLocalMetadata.Current.Value,
			EnableAutomaticSeriesGrouping: this.EnableAutomaticSeriesGrouping.Current.Value,
			EnableEmbeddedTitles: this.EnableEmbeddedTitles.Current.Value,
			EnableEmbeddedExtrasTitles: this.EnableEmbeddedExtrasTitles.Current.Value,
			EnableEmbeddedEpisodeInfos: this.EnableEmbeddedEpisodeInfos.Current.Value,
			AutomaticRefreshIntervalDays: this.AutomaticRefreshIntervalDays.Current.Value,
			PreferredMetadataLanguage: this.PreferredMetadataLanguage.Current.Value,
			MetadataCountryCode: this.MetadataCountryCode.Current.Value,
			SeasonZeroDisplayName: this.SeasonZeroDisplayName.Current.Value,
			MetadataSavers: this.MetadataSavers.Current.Value,
			DisabledLocalMetadataReaders: this.DisabledLocalMetadataReaders.Current.Value,
			LocalMetadataReaderOrder: this.LocalMetadataReaderOrder.Current.Value,
			DisabledSubtitleFetchers: this.DisabledSubtitleFetchers.Current.Value,
			SubtitleFetcherOrder: this.SubtitleFetcherOrder.Current.Value,
			DisabledMediaSegmentProviders: this.DisabledMediaSegmentProviders.Current.Value,
			MediaSegmentProviderOrder: this.MediaSegmentProviderOrder.Current.Value,
			SkipSubtitlesIfEmbeddedSubtitlesPresent: this.SkipSubtitlesIfEmbeddedSubtitlesPresent.Current.Value,
			SkipSubtitlesIfAudioTrackMatches: this.SkipSubtitlesIfAudioTrackMatches.Current.Value,
			SubtitleDownloadLanguages: this.SubtitleDownloadLanguages.Current.Value,
			RequirePerfectSubtitleMatch: this.RequirePerfectSubtitleMatch.Current.Value,
			SaveSubtitlesWithMedia: this.SaveSubtitlesWithMedia.Current.Value,
			SaveLyricsWithMedia: this.SaveLyricsWithMedia.Current.Value,
			SaveTrickplayWithMedia: this.SaveTrickplayWithMedia.Current.Value,
			DisabledLyricFetchers: this.DisabledLyricFetchers.Current.Value,
			LyricFetcherOrder: this.LyricFetcherOrder.Current.Value,
			PreferNonstandardArtistsTag: this.PreferNonstandardArtistsTag.Current.Value,
			UseCustomTagDelimiters: this.UseCustomTagDelimiters.Current.Value,
			CustomTagDelimiters: this.CustomTagDelimiters.Current.Value,
			DelimiterWhitelist: this.DelimiterWhitelist.Current.Value,
			AutomaticallyAddToCollection: this.AutomaticallyAddToCollection.Current.Value,
			AllowEmbeddedSubtitles: this.AllowEmbeddedSubtitles.Current.Value,
			TypeOptions: this.TypeOptions.map((to) => to.CreateRequest()),
		};
	}

	public AllFields(): IEditableField[] {
		const fields: IEditableField[] = [
			this.Locations,
			this.Enabled,
			this.EnablePhotos,
			this.EnableRealtimeMonitor,
			this.EnableLUFSScan,
			this.EnableChapterImageExtraction,
			this.ExtractChapterImagesDuringLibraryScan,
			this.EnableTrickplayImageExtraction,
			this.ExtractTrickplayImagesDuringLibraryScan,
			this.SaveLocalMetadata,
			this.EnableAutomaticSeriesGrouping,
			this.EnableEmbeddedTitles,
			this.EnableEmbeddedExtrasTitles,
			this.EnableEmbeddedEpisodeInfos,
			this.AutomaticRefreshIntervalDays,
			this.PreferredMetadataLanguage,
			this.MetadataCountryCode,
			this.SeasonZeroDisplayName,
			this.MetadataSavers,
			this.DisabledLocalMetadataReaders,
			this.LocalMetadataReaderOrder,
			this.DisabledSubtitleFetchers,
			this.SubtitleFetcherOrder,
			this.DisabledMediaSegmentProviders,
			this.MediaSegmentProviderOrder,
			this.SkipSubtitlesIfEmbeddedSubtitlesPresent,
			this.SkipSubtitlesIfAudioTrackMatches,
			this.SubtitleDownloadLanguages,
			this.RequirePerfectSubtitleMatch,
			this.SaveSubtitlesWithMedia,
			this.SaveLyricsWithMedia,
			this.SaveTrickplayWithMedia,
			this.DisabledLyricFetchers,
			this.LyricFetcherOrder,
			this.PreferNonstandardArtistsTag,
			this.UseCustomTagDelimiters,
			this.CustomTagDelimiters,
			this.DelimiterWhitelist,
			this.AutomaticallyAddToCollection,
			this.AllowEmbeddedSubtitles,
		];

		this.TypeOptions.forEach((to) => fields.push(...to.AllFields()));

		return fields;
	}

	public HasChanged: Computed<boolean>;
	public CanMakeRequest: Computed<boolean>;

	public Locations: EditableField<string[]>;
	public Enabled: EditableField<boolean>;
	public EnablePhotos: EditableField<boolean>;
	public EnableRealtimeMonitor: EditableField<boolean>;
	public EnableLUFSScan: EditableField<boolean>;
	public EnableChapterImageExtraction: EditableField<boolean>;
	public ExtractChapterImagesDuringLibraryScan: EditableField<boolean>;
	public EnableTrickplayImageExtraction: EditableField<boolean>;
	public ExtractTrickplayImagesDuringLibraryScan: EditableField<boolean>;
	public SaveLocalMetadata: EditableField<boolean>;
	public EnableAutomaticSeriesGrouping: EditableField<boolean>;
	public EnableEmbeddedTitles: EditableField<boolean>;
	public EnableEmbeddedExtrasTitles: EditableField<boolean>;
	public EnableEmbeddedEpisodeInfos: EditableField<boolean>;
	public AutomaticRefreshIntervalDays: EditableField<number>;
	public PreferredMetadataLanguage: EditableField<string>;
	public MetadataCountryCode: EditableField<string>;
	public SeasonZeroDisplayName: EditableField<string>;
	public MetadataSavers: EditableField<Array<string>>;
	public DisabledLocalMetadataReaders: EditableField<Array<string>>;
	public LocalMetadataReaderOrder: EditableField<Array<string>>;
	public DisabledSubtitleFetchers: EditableField<Array<string>>;
	public SubtitleFetcherOrder: EditableField<Array<string>>;
	public DisabledMediaSegmentProviders: EditableField<Array<string>>;
	public MediaSegmentProviderOrder: EditableField<Array<string>>;
	public SkipSubtitlesIfEmbeddedSubtitlesPresent: EditableField<boolean>;
	public SkipSubtitlesIfAudioTrackMatches: EditableField<boolean>;
	public SubtitleDownloadLanguages: EditableField<Array<string>>;
	public RequirePerfectSubtitleMatch: EditableField<boolean>;
	public SaveSubtitlesWithMedia: EditableField<boolean>;
	public SaveLyricsWithMedia: EditableField<boolean>;
	public SaveTrickplayWithMedia: EditableField<boolean>;
	public DisabledLyricFetchers: EditableField<Array<string>>;
	public LyricFetcherOrder: EditableField<Array<string>>;
	public PreferNonstandardArtistsTag: EditableField<boolean>;
	public UseCustomTagDelimiters: EditableField<boolean>;
	public CustomTagDelimiters: EditableField<Array<string>>;
	public DelimiterWhitelist: EditableField<Array<string>>;
	public AutomaticallyAddToCollection: EditableField<boolean>;
	public AllowEmbeddedSubtitles: EditableField<EmbeddedSubtitleOptions>;
	public TypeOptions: EditableLibraryItemTypeOptions[];

	public Existing: VirtualFolderInfo|undefined;
	public LibraryOptions: LibraryOptionsResultDto;
	public IsNew: boolean;
}
