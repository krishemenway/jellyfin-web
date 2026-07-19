
import * as React from "react";
import { AnchoredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { FieldLabel } from "Common/FieldLabel";
import { Layout } from "Common/Layout";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { BaseItemDto, MetadataRefreshMode } from "@jellyfin/sdk/lib/generated-client/models";
import { TranslatedText, useTranslatedText } from "Common/TranslatedText";
import { RefreshIcon } from "CommonIcons/RefreshIcon";
import { EditableField } from "Common/EditableField";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { useObservable } from "@residualeffect/rereactor";
import { Form } from "Common/Form";
import { getItemRefreshApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { Receiver } from "Common/Receiver";
import { useIsBusy } from "Common/Loading";

const refreshAction = new EditableField<MetadataRefreshMode>("RefreshMode", "Default");
const replaceImages = new EditableField<boolean>("ReplaceExistingImages", false);
const replaceTrickplayImages = new EditableField<boolean>("ReplaceTrickplayImages", false);
const refreshReceiver = new Receiver("UnknownError");
const allFields = [ refreshAction, replaceImages, replaceTrickplayImages ];

const refreshItem = (item: BaseItemDto, onSuccess: () => void) => {
	refreshReceiver.Start((a) => getItemRefreshApi(ServerService.Instance.CurrentApi).refreshItem({ 
		itemId: item.Id!,
		imageRefreshMode: refreshAction.Current.Value,
		metadataRefreshMode: refreshAction.Current.Value,
		replaceAllImages: replaceImages.Current.Value,
		regenerateTrickplay: replaceTrickplayImages.Current.Value,
	}, { signal: a.signal }).then(() => { onSuccess(); }))
}

export const ItemRefreshButton: React.FC<{ item: BaseItemDto }> = ({ item }) => {
	const isRefreshing = useIsBusy(refreshReceiver);
	const mode = useObservable(refreshAction.Current);
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);

	const closeNavigation = () => {
		allFields.forEach((f) => f.Revert());
		refreshReceiver.Reset();
		setOpenAnchor(null);
	};

	return (
		<>
			<Button
				type="button" onClick={(element) => setOpenAnchor(element)}
				icon={<RefreshIcon />}
				alignItems="center" px=".5em" py=".5em"
			/>

			<AnchoredModal backgroundColor="AlternatePanel" anchorAlignment="center" opensInDirection="left" anchorElement={anchor} open={anchor !== null} onClosed={closeNavigation}>
				<Form onSubmit={() => { refreshItem(item, closeNavigation); }} direction="column" gap=".5rem" px="1rem" py="1rem">
					<Layout direction="column" gap=".5rem">
						<FieldLabel field={refreshAction} textKey="LabelRefreshMode" />
						<SelectFieldEditor
							px=".5em" py=".25em"
							field={refreshAction} 
							allOptions={[MetadataRefreshMode.Default, MetadataRefreshMode.ValidationOnly, MetadataRefreshMode.FullRefresh]}
							getLabel={(m) => useTranslatedText({ Key: `RefreshMode-${m}` })}
							getValue={(m) => m}
							getKey={m => m}
						/>
					</Layout>

					{mode !== "Default" && (
						<Layout direction="row" gap="1rem" fontSizeREM={.8} alignItems="center" px=".25rem">
							<ToggleSwitch field={replaceImages} px=".25em" py=".25em" />
							<FieldLabel field={replaceImages} py=".5em" />
						</Layout>
					)}

					{mode !== "Default" && (
						<Layout direction="row" gap="1rem" fontSizeREM={.8} alignItems="center" px=".25rem">
							<ToggleSwitch field={replaceTrickplayImages} px=".25em" py=".25em" />
							<FieldLabel field={replaceTrickplayImages} py=".5em" />
						</Layout>
					)}

					<Layout direction="row" maxWidth="26em" fontSizeREM={.8} py=".5rem"><TranslatedText textKey="RefreshDialogHelp" /></Layout>

					<Layout direction="row" justifyContent="end" gap=".5rem">
						<Button type="button" label="ButtonCancel" onClick={closeNavigation} px=".5em" py=".25em" disabled={isRefreshing} />
						<Button type="submit" icon={isRefreshing ? <RefreshIcon /> : undefined} label="Refresh" px=".5em" py=".25em" disabled={isRefreshing} />
					</Layout>
				</Form>
			</AnchoredModal>
		</>
	);
};
