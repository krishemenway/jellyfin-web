import * as React from "react";
import { CenteredModal } from "Common/Modal";
import { TextField } from "Common/TextField";
import { getConfigurationApi } from "@jellyfin/sdk/lib/utils/api";
import { EditableField, IEditableField } from "Common/EditableField";
import { LocalizationOption, ServerConfiguration } from "@jellyfin/sdk/lib/generated-client/models";
import { Receiver } from "Common/Receiver";
import { Loading, useDataOrNull } from "Common/Loading";
import { ServerService } from "Servers/ServerService";
import { Form } from "Common/Form";
import { Button } from "Common/Button";
import { Layout } from "Common/Layout";
import { FieldLabel } from "Common/FieldLabel";
import { FieldError } from "Common/FieldError";
import { Computed, Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { LocalizationOptionsStore } from "ServerAdmin/LocalizationOptionsStore";
import { Linq } from "Common/MissingJavascriptFunctions";
import { ToggleSwitch } from "Common/ToggleSwitch";

export class GeneralSettingsService {
	constructor() {
		this.Current = new Receiver("UnknownError");
		this.SaveRequest = new Receiver("UnknownError");
	}

	public Load(localizationOptions: LocalizationOption[]): void {
		this.Current.Start((a) => getConfigurationApi(ServerService.Instance.CurrentApi).getConfiguration({ signal: a.signal }).then((r) => new EditableGeneralSettings(r.data, localizationOptions)));
	}

	public Save(): void {
		this.SaveRequest.Start((a) => getConfigurationApi(ServerService.Instance.CurrentApi).updateConfiguration({ serverConfiguration: this.Current.Data.Value.ReceivedData?.CreateRequest() ?? {}}, { signal: a.signal }).then(() => undefined));
	}

	public Current: Receiver<EditableGeneralSettings>;
	public SaveRequest: Receiver<undefined>;

	static get Instance(): GeneralSettingsService {
		return this._instance ?? (this._instance = new GeneralSettingsService());
	}

	private static _instance: GeneralSettingsService;
}

class EditableGeneralSettings {
	constructor(config: ServerConfiguration, localizationOptions: LocalizationOption[]) {
		this._originalConfig = config;
		this.ServerName = new EditableField("LabelServerName", this._originalConfig.ServerName ?? "");
		this.PreferredDisplayLanguage = new EditableField("LabelPreferredDisplayLanguage", Linq.Single(localizationOptions, (o) => o.Value === this._originalConfig.UICulture));

		this.QuickConnectAvailable = new EditableField("EnableQuickConnect", this._originalConfig.QuickConnectAvailable ?? false);

		this.CachePath = new EditableField("LabelCachePath", this._originalConfig.CachePath ?? "");
		this.MetadataPath = new EditableField("LabelMetadataPath", this._originalConfig.MetadataPath ?? "");

		this.LibraryScanFanoutConcurrency = new EditableField("LibraryScanFanoutConcurrency", this._originalConfig.LibraryScanFanoutConcurrency?.toString() ?? "");
		this.ParallelImageEncodingLimit = new EditableField("LabelParallelImageEncodingLimit", this._originalConfig.ParallelImageEncodingLimit?.toString() ?? "");

		this._allEditableFields = [
			this.ServerName,
			this.PreferredDisplayLanguage,
			this.QuickConnectAvailable,

			this.CachePath,
			this.MetadataPath,

			this.LibraryScanFanoutConcurrency,
			this.ParallelImageEncodingLimit,
		];

		this.ShowErrors = new Observable(false);
		this.CanSave = new Computed(() => this._allEditableFields.every((f) => f.CanMakeRequest()))
	}

	public CreateRequest(): ServerConfiguration {
		const newConfig = this._originalConfig;

		newConfig.ServerName = this.ServerName.Current.Value;
		newConfig.UICulture = this.PreferredDisplayLanguage.Current.Value.Value ?? undefined;
		newConfig.QuickConnectAvailable = this.QuickConnectAvailable.Current.Value;
	
		newConfig.CachePath = this.CachePath.Current.Value;
		newConfig.MetadataPath = this.MetadataPath.Current.Value;

		newConfig.LibraryScanFanoutConcurrency = parseInt(this.LibraryScanFanoutConcurrency.Current.Value);
		newConfig.ParallelImageEncodingLimit = parseInt(this.ParallelImageEncodingLimit.Current.Value);

		return newConfig;
	}

	public ShowErrors: Observable<boolean>;
	public CanSave: Computed<boolean>;

	public ServerName: EditableField<string>;

	public CachePath: EditableField<string>;
	public MetadataPath: EditableField<string>;

	public PreferredDisplayLanguage: EditableField<LocalizationOption>;

	public QuickConnectAvailable: EditableField<boolean>;

	public LibraryScanFanoutConcurrency: EditableField<string>;
	public ParallelImageEncodingLimit: EditableField<string>;

	private _allEditableFields: IEditableField[];
	private _originalConfig: ServerConfiguration;
}

export const EditGeneralSettingsModal: React.FC = () => {
	const settings = useDataOrNull(GeneralSettingsService.Instance.Current);

	return (
		<CenteredModal open={settings !== null} onClosed={() => { GeneralSettingsService.Instance.Current.Reset(); }}>
			<Loading
				receivers={[GeneralSettingsService.Instance.Current, LocalizationOptionsStore.Instance.LocalizationOptions]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4rem" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4rem" />}
				whenReceived={(settings, localizationOptions) => <LoadedSettings settings={settings} localizationOptions={localizationOptions} />}
			/>
		</CenteredModal>
	)
};

const LoadedSettings: React.FC<{ settings: EditableGeneralSettings; localizationOptions: LocalizationOption[] }> = (props) => {
	const showErrors = useObservable(props.settings.ShowErrors);

	return (
		<Form direction="column" onSubmit={() => GeneralSettingsService.Instance.Save()} gap="1.25rem" px="1rem" py="1rem">
			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.ServerName} />
				<TextField field={props.settings.ServerName} px=".5rem" py=".25rem" />
				<FieldError field={props.settings.ServerName} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.PreferredDisplayLanguage} />

				<AutoCompleteFieldEditor
					px=".5rem" py=".25rem"
					field={props.settings.PreferredDisplayLanguage}
					allOptions={props.localizationOptions}
					getLabel={(lo) => lo.Name}
					getValue={(lo) => lo.Value ?? ""}
				/>

				<FieldError field={props.settings.PreferredDisplayLanguage} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.CachePath} />
				<TextField field={props.settings.CachePath} px=".5rem" py=".25rem" />
				<FieldError field={props.settings.CachePath} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.MetadataPath} />
				<TextField field={props.settings.MetadataPath} px=".5rem" py=".25rem" />
				<FieldError field={props.settings.MetadataPath} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<Layout direction="row" gap=".5rem" alignItems="center">
					<ToggleSwitch field={props.settings.QuickConnectAvailable} />
					<FieldLabel field={props.settings.QuickConnectAvailable} />
				</Layout>

				<FieldError field={props.settings.QuickConnectAvailable} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.LibraryScanFanoutConcurrency} />
				<TextField field={props.settings.LibraryScanFanoutConcurrency} px=".5rem" py=".25rem" />
				<FieldError field={props.settings.LibraryScanFanoutConcurrency} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".5rem">
				<FieldLabel field={props.settings.ParallelImageEncodingLimit} />
				<TextField field={props.settings.ParallelImageEncodingLimit} px=".5rem" py=".25rem" />
				<FieldError field={props.settings.ParallelImageEncodingLimit} showErrors={showErrors} />
			</Layout>

			<Layout direction="row" justifyContent="end">
				<Button type="submit" label="Save" px=".5rem" py=".25rem" />
			</Layout>
		</Form>
	)
};
