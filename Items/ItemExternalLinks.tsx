import * as React from "react";
import { BaseItemDto, ExternalIdInfo, MetadataEditorInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { EditableItemProps } from "./EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemEditorService } from "./ItemEditorService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { useObservable } from "node_modules/@residualeffect/rereactor/lib";
import { TextField } from "Common/TextField";
import { Button } from "Common/Button";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { EditableField } from "Common/EditableField";
import { EditableItemProvider } from "./EditableItemProvider";
import { DeleteIcon } from "CommonIcons/DeleteIcon";

export const ItemExternalLinks: React.FC<{ item: BaseItemDto, linkLayout?: StyleLayoutProps, linkClassName?: string }&EditableItemProps&BaseListProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<Loading
				receivers={[ItemEditorService.Instance.MetadataInfo]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(metadataInfo) => <ExternalProviderEditors metadataInfo={metadataInfo} {...props} />}
			/>
		);
	}

	return (
		<ListOf
			items={props.item.ExternalUrls ?? []}
			forEachItem={(url, index) => <HyperLink key={url.Url ?? index.toString()} to={url.Url ?? "/NotFound"} direction="row" {...props.linkLayout} className={props.linkClassName}>{url.Name}</HyperLink>}
			{...props}
		/>
	);
};

const ExternalProviderEditors: React.FC<{ metadataInfo: MetadataEditorInfo; linkLayout?: StyleLayoutProps }&EditableItemProps&BaseListProps> = (props) => {
	const editableItemProviders = useObservable(props.editableItem!.ProviderIds);
	const getName = (key: string) => props.metadataInfo.ExternalIdInfos?.find(i => i.Key === key)?.Name;
	const editableItemProviderKeys = editableItemProviders.map(p => p.Key);
	const remainingProviders = props.metadataInfo.ExternalIdInfos?.filter((info) => editableItemProviderKeys.indexOf(info.Key ?? "") === -1) ?? [];
	const [selectNewProviderField, _] = React.useState(new EditableField<ExternalIdInfo|undefined>("AddProviderOptions", remainingProviders[0]));

	React.useEffect(() => {
		selectNewProviderField.OnChange(remainingProviders[0]);
		selectNewProviderField.OnSaved();
	}, [remainingProviders]);

	return (
		<ListOf
			items={editableItemProviders}
			forEachItem={(editableItemProvider) => (
				<Layout direction="row" key={editableItemProvider.Key} {...props.linkLayout}>
					{getName(editableItemProvider.Key)}
					<TextField field={editableItemProvider.Value} />
					<Button type="button" onClick={() => { props.editableItem!.ProviderIds.remove(editableItemProvider); }} icon={<DeleteIcon />} />
				</Layout>
			)}
			afterItems={remainingProviders.length > 0 && (
				<Layout direction="row">
					<SelectFieldEditor
						field={selectNewProviderField}
						allOptions={remainingProviders}
						getLabel={(i) => i?.Name}
						getValue={(i) => i?.Key ?? ""}
					/>

					<Button type="button" onClick={() => { props.editableItem?.ProviderIds.push(new EditableItemProvider(selectNewProviderField.Current.Value?.Key!, "")); }} label="Add" />
				</Layout>
			)}
			{...props}
		/>
	)
};
