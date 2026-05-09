import * as React from "react";
import { Layout } from "Common/Layout";
import { useParams } from "react-router";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ServerIcon } from "Servers/ServerIcon";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { getLibraryApi, getLibraryStructureApi } from "@jellyfin/sdk/lib/utils/api";
import { EditableLibrary } from "./EditableLibrary";
import { Receiver } from "Common/Receiver";
import { ServerService } from "./ServerService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { CollectionType, EmbeddedSubtitleOptions, LibraryOptionsResultDto } from "node_modules/@jellyfin/sdk/lib/generated-client/models";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { PageTitle } from "Common/PageTitle";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedText, useTranslatedText } from "Common/TranslatedText";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { TextField } from "Common/TextField";

class LibraryManager {
	constructor() {
		this.EditableLibrary = new Receiver("UnknownError");
		this.LibraryOptions = new Receiver("UnknownError");
	}

	public LoadWithAbort(libraryId: string): () => void {
		this.EditableLibrary.Start((a) => getLibraryStructureApi(ServerService.Instance.CurrentApi).getVirtualFolders({ signal: a.signal }).then(response => {
			const library = new EditableLibrary(response.data.find((l) => l.ItemId === libraryId));
			this.LibraryOptions.Start((a) => getLibraryApi(ServerService.Instance.CurrentApi).getLibraryOptionsInfo({ libraryContentType: library.Existing?.CollectionType as CollectionType, isNewLibrary: library.IsNew }, { signal: a.signal }).then((r) => r.data));
			return library;
		}));

		return () => { this.EditableLibrary.ResetIfLoading(); this.LibraryOptions.ResetIfLoading(); };
	}

	public EditableLibrary: Receiver<EditableLibrary>;
	public LibraryOptions: Receiver<LibraryOptionsResultDto>;

	static get Instance(): LibraryManager {
		return this._instance ?? (this._instance = new LibraryManager());
	}

	private static _instance: LibraryManager;
}

export const ManageLibrary: React.FC = () => {
	const libraryId = useParams<{ libraryId: string }>().libraryId;

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={<ServerIcon />}><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => LibraryManager.Instance.LoadWithAbort(libraryId), [libraryId])

	return (
		<PageWithNavigation icon={<ServerIcon />}>
			<Loading
				receivers={[LibraryManager.Instance.EditableLibrary, LibraryManager.Instance.LibraryOptions]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="3rem" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="3rem" />}
				whenReceived={(editableLibrary, libraryOptions) => <LoadedLibraryManager editableLibrary={editableLibrary} libraryOptions={libraryOptions} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedLibraryManager: React.FC<{ editableLibrary: EditableLibrary; libraryOptions: LibraryOptionsResultDto }> = ({ editableLibrary, libraryOptions }) => {
	return (
		<Layout direction="column" gap="1rem">
			<PageTitle text={editableLibrary.Existing?.Name} />

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<ToggleSwitch field={editableLibrary.Enabled} />
					<FieldLabel field={editableLibrary.Enabled} textKey="EnableLibrary" />
				</Layout>

				<TranslatedText textKey="EnableLibraryHelp" elementType="div" />
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

			<Layout direction="column" gap=".25rem">
				<FieldLabel field={editableLibrary.SeasonZeroDisplayName} textKey="LabelSpecialSeasonsDisplayName" />
				<TextField field={editableLibrary.SeasonZeroDisplayName} px=".5em" py=".25em" />
			</Layout>

			<Layout direction="column" gap=".25rem">
				<Layout direction="row" gap="1em">
					<SelectFieldEditor
						field={editableLibrary.AllowEmbeddedSubtitles}
						allOptions={[EmbeddedSubtitleOptions.AllowAll, EmbeddedSubtitleOptions.AllowText, EmbeddedSubtitleOptions.AllowImage, EmbeddedSubtitleOptions.AllowNone]}
						getLabel={(l) => useTranslatedText({ Key: `AllowEmbeddedSubtitles${l}Option` })}
						getValue={(l) => l}
					/>

					<FieldLabel field={editableLibrary.AllowEmbeddedSubtitles} textKey="AllowEmbeddedSubtitles" />
				</Layout>

				<TranslatedText textKey="AllowEmbeddedSubtitlesHelp" elementType="div" />
			</Layout>
		</Layout>
	);
};
