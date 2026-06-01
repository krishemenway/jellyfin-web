import * as React from "react";
import { BaseItemDto, ExternalIdInfo, MetadataEditorInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { ItemEditorService } from "Items/ItemEditorService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { useObservable } from "@residualeffect/rereactor";
import { TextField } from "Common/TextField";
import { Button } from "Common/Button";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { EditableField } from "Common/EditableField";
import { EditableItemProvider } from "Items/EditableItemProvider";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { useBreakpointValues } from "AppStyles";
import { AddIcon } from "CommonIcons/AddIcon";
import { FieldLabel } from "Common/FieldLabel";
import { Collapsible } from "Common/Collapsible";

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
	const getName = (key: string) => Linq.First(props.metadataInfo.ExternalIdInfos ?? [], i => i.Key === key)?.Name;
	const editableItemProviderKeys = editableItemProviders.map(p => p.Key);
	const remainingProviders = props.metadataInfo.ExternalIdInfos?.filter((info) => editableItemProviderKeys.indexOf(info.Key ?? "") === -1) ?? [];
	const [selectNewProviderField] = React.useState(new EditableField<ExternalIdInfo>("AddProviderOptions", remainingProviders[0]));
	const itemPerRow = useBreakpointValues(1, 1, 1, 2);

	React.useEffect(() => {
		selectNewProviderField.OnChange(remainingProviders[0]);
		selectNewProviderField.OnSaved();
	}, [remainingProviders]);

	return (
		<Layout direction="row" wrap gap=".25rem">
			{editableItemProviders.map((editableItemProvider) => (
				<Layout direction="column" key={editableItemProvider.Key} width={{ itemsPerRow: itemPerRow, gap: ".25rem" }} gap=".25rem">
					<Layout direction="row" justifyContent="space-between">
						<FieldLabel field={editableItemProvider.Value} text={getName(editableItemProvider.Key) ?? editableItemProvider.Key} />
						<Button type="button" px=".25em" py=".25em" onClick={() => { props.editableItem!.ProviderIds.remove(editableItemProvider); }} icon={<DeleteIcon />} />
					</Layout>

					<TextField field={editableItemProvider.Value} />
				</Layout>
			))}

			<Collapsible open={remainingProviders.length > 0}>
				<Layout direction="row" width={{ itemsPerRow: itemPerRow, gap: ".25rem" }} gap=".25rem" py=".5rem">
					<SelectFieldEditor
						field={selectNewProviderField}
						allOptions={remainingProviders}
						getLabel={(i) => i?.Name}
						getValue={(i) => i?.Key ?? ""}
						py=".5em"
						grow
					/>

					<Button type="button" px=".5em" py=".5em" onClick={() => { props.editableItem?.ProviderIds.push(new EditableItemProvider(selectNewProviderField.Current.Value.Key!, "")); }} icon={<AddIcon />} alignItems="center" />
				</Layout>
			</Collapsible>
		</Layout>
	);
};
