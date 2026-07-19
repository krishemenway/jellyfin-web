import * as React from "react";
import { Layout } from "Common/Layout";
import { useParams } from "react-router";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { Loading, useDataOrNull } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { getLibraryApi, getLibraryStructureApi } from "@jellyfin/sdk/lib/utils/api";
import { EditableLibrary } from "Servers/EditableLibrary";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { CollectionType, EmbeddedSubtitleOptions } from "@jellyfin/sdk/lib/generated-client/models";
import { BaseToggleSwitch, ToggleSwitch } from "Common/ToggleSwitch";
import { PageTitle } from "Common/PageTitle";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedText, useTranslatedText } from "Common/TranslatedText";
import { MultiSelectEditor, SelectFieldEditor } from "Common/SelectFieldEditor";
import { TextField } from "Common/TextField";
import { EditableField } from "Common/EditableField";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";
import { Form } from "Common/Form";
import { EditableLibraryItemTypeOptions } from "Servers/EditableLibraryItemTypeOptions";
import { useObservable } from "@residualeffect/rereactor";
import { ListOf } from "Common/ListOf";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";
import { Button } from "Common/Button";

class LibraryManager {
	constructor() {
		this.EditableLibrary = new Receiver("UnknownError");
	}

	public SaveLibrary(): void {
		console.log("Submit");
	}

	public LoadWithAbort(libraryId: string): () => void {
		this.EditableLibrary.Start((a) => getLibraryStructureApi(ServerService.Instance.CurrentApi).getVirtualFolders({ signal: a.signal }).then(async response => {
			const library = response.data.single((l) => l.ItemId === libraryId);
			const collectionType = library.CollectionType as CollectionType;
			const libraryOptions = await getLibraryApi(ServerService.Instance.CurrentApi).getLibraryOptionsInfo({ libraryContentType: collectionType, isNewLibrary: false }, { signal: a.signal }).then((r) => r.data);

			return new EditableLibrary(collectionType, libraryOptions, library);
		}));

		return () => this.EditableLibrary.ResetIfLoading();
	}

	public EditableLibrary: Receiver<EditableLibrary>;

	static get Instance(): LibraryManager {
		return this._instance ?? (this._instance = new LibraryManager());
	}

	private static _instance: LibraryManager;
}

export const ManageLibrary: React.FC = () => {
	const libraryId = useParams<{ libraryId: string }>().libraryId!;

	React.useEffect(() => LibraryManager.Instance.LoadWithAbort(libraryId), [libraryId])

	return (
		<PageWithNavigation icon={<ServerIcon />} content={() => (
			<Loading
				receivers={[LibraryManager.Instance.EditableLibrary]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} retryAction={() => LibraryManager.Instance.LoadWithAbort(libraryId)} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(editableLibrary) => <LoadedLibraryManager editableLibrary={editableLibrary} />}
			/>
		)} />
	);
};

const LoadedLibraryManager: React.FC<{ editableLibrary: EditableLibrary }> = ({ editableLibrary }) => {
	return (
		<Form direction="column" gap="1rem" onSubmit={() => { LibraryManager.Instance.SaveLibrary(); }}>
			<PageTitle text={editableLibrary.Existing?.Name} />

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<ToggleSwitch field={editableLibrary.Enabled} />
					<FieldLabel field={editableLibrary.Enabled} textKey="EnableLibrary" />
				</Layout>

				<TranslatedText textKey="EnableLibraryHelp" elementType="div" />
			</Layout>

			<Layout direction="column">
				<TranslatedText textKey="Folders" elementType="div" />
				<MultiSelectEditor
					allOptions={[]}
					field={editableLibrary.Locations}
					getLabel={(l) => l}
					getValue={(l) => l}
					createNew={(l) => l}
				/>
			</Layout>

			<Layout direction="column">
				<TranslatedText textKey="LabelMetadataDownloadLanguage" elementType="div" />
				<LanguageSelector languageField={editableLibrary.PreferredMetadataLanguage} />
			</Layout>

			<Layout direction="column">
				<TranslatedText textKey="LabelCountry" elementType="div" />
				<CountrySelector countryField={editableLibrary.MetadataCountryCode} />
			</Layout>

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<ToggleSwitch field={editableLibrary.EnableEmbeddedTitles} />
					<FieldLabel field={editableLibrary.EnableEmbeddedTitles} textKey="PreferEmbeddedTitlesOverFileNames" />
				</Layout>

				<TranslatedText textKey="PreferEmbeddedTitlesOverFileNamesHelp" elementType="div" />
			</Layout>

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<ToggleSwitch field={editableLibrary.EnableEmbeddedEpisodeInfos} />
					<FieldLabel field={editableLibrary.EnableEmbeddedEpisodeInfos} textKey="PreferEmbeddedEpisodeInfosOverFileNames" />
				</Layout>

				<TranslatedText textKey="PreferEmbeddedEpisodeInfosOverFileNamesHelp" elementType="div" />
			</Layout>

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<ToggleSwitch field={editableLibrary.EnableRealtimeMonitor} />
					<FieldLabel field={editableLibrary.EnableRealtimeMonitor} textKey="LabelEnableRealtimeMonitor" />
				</Layout>

				<TranslatedText textKey="LabelEnableRealtimeMonitorHelp" elementType="div" />
			</Layout>

			{editableLibrary.TypeOptions.map(typeOption => <EditableTypeOptions key={typeOption.Type} typeOption={typeOption} />)}

			<Layout direction="column" gap=".25rem">
				<FieldLabel field={editableLibrary.SeasonZeroDisplayName} textKey="LabelSpecialSeasonsDisplayName" />
				<TextField field={editableLibrary.SeasonZeroDisplayName} px=".5em" py=".25em" bt br bb bl backgroundColor="Field" />
			</Layout>

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<SelectFieldEditor
						field={editableLibrary.AllowEmbeddedSubtitles}
						allOptions={[EmbeddedSubtitleOptions.AllowAll, EmbeddedSubtitleOptions.AllowText, EmbeddedSubtitleOptions.AllowImage, EmbeddedSubtitleOptions.AllowNone]}
						getLabel={(l) => useTranslatedText({ Key: `AllowEmbeddedSubtitles${l}Option` })}
						getValue={(l) => l}
						getKey={l => l}
					/>

					<FieldLabel field={editableLibrary.AllowEmbeddedSubtitles} textKey="AllowEmbeddedSubtitles" />
				</Layout>

				<TranslatedText textKey="AllowEmbeddedSubtitlesHelp" elementType="div" />
			</Layout>
		</Form>
	);
};

const EditableTypeOptions: React.FC<{ typeOption: EditableLibraryItemTypeOptions }> = ( { typeOption }) => {
	const fetcherOrder = useObservable(typeOption.MetadataFetcherOrder.Current);
	const enabledFetchers = useObservable(typeOption.MetadataFetchers.Current);

	return (
		<Layout direction="column">
			<Layout direction="row" fontSizeREM={1.2}>
				<TranslatedText textKey="LabelTypeMetadataDownloaders" textProps={[typeOption.Type!]} />
			</Layout>

			<ListOf
				items={fetcherOrder}
				direction="column" gap=".5rem" px="1rem" py=".5rem"
				forEachItem={(fetcher, index) => (
					<Layout key={fetcher} direction="row" gap="1rem" alignItems="center" justifyContent="space-between" maxWidth="25rem">
						<BaseToggleSwitch enabled={enabledFetchers.indexOf(fetcher) > -1} onChange={() => typeOption.MetadataFetchers.OnChange(enabledFetchers.toggleItem(fetcher))} />

						<Layout direction="row">{fetcher}</Layout>

						<Layout direction="row" gap=".25rem">
							<Button type="button" onClick={() => { typeOption.MetadataFetcherOrder.OnChange(fetcherOrder.swap(index, index - 1)); }} icon={<ArrowUpIcon />} px=".25em" py=".25em" />
							<Button type="button" onClick={() => { typeOption.MetadataFetcherOrder.OnChange(fetcherOrder.swap(index, index + 1)); }} icon={<ArrowDownIcon />} px=".25em" py=".25em" />
						</Layout>
					</Layout>
				)}
			/>

			<Layout direction="row" px="1rem">
				<TranslatedText textKey="LabelMetadataDownloadersHelp" />
			</Layout>
		</Layout>
	);
};

const LanguageSelector: React.FC<{ languageField: EditableField<string> }> = ({ languageField }) => {
	const allLanguages = [LocalizationOptionsStore.Instance.EmptyCulture].concat(useDataOrNull(LocalizationOptionsStore.Instance.LocalizationCultures) ?? []);
	const allLanguageCodes = React.useMemo(() => allLanguages.map((d) => d.TwoLetterISOLanguageName!), [allLanguages]);
	const languageByCode = React.useMemo(() => allLanguages.toRecord((l) => l.TwoLetterISOLanguageName ?? ""), [allLanguages]);

	React.useEffect(() => LocalizationOptionsStore.Instance.LoadCultures(), []);

	return (
		<SelectFieldEditor
			allOptions={allLanguageCodes}
			field={languageField}
			getLabel={(l) => languageByCode[l].DisplayName}
			getValue={(l) => l}
			getKey={l => l}
			px=".5em" py=".25em" maxWidth="25em"
		/>
	);
};

const CountrySelector: React.FC<{ countryField: EditableField<string> }> = ({ countryField }) => {
	const allCountries = [LocalizationOptionsStore.Instance.EmptyCountry].concat(useDataOrNull(LocalizationOptionsStore.Instance.LocalizationCountries) ?? []);
	const allCountryCodes = React.useMemo(() => allCountries.map((d) => d.TwoLetterISORegionName!), [allCountries]);
	const countriesByCode = React.useMemo(() => allCountries.toRecord((country) => country.TwoLetterISORegionName ?? ""), [allCountries]);

	React.useEffect(() => LocalizationOptionsStore.Instance.LoadCountries(), []);

	return (
		<SelectFieldEditor
			allOptions={allCountryCodes}
			field={countryField}
			getLabel={(l) => countriesByCode[l].DisplayName}
			getValue={(l) => l}
			getKey={l => l}
			px=".5em" py=".25em" maxWidth="25em"
		/>
	);
};
