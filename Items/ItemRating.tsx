import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { EditableItemProps } from "Items/EditableItemProps";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { ItemEditorService } from "Items/ItemEditorService";
import { Loading } from "Common/Loading";

export const ItemRating: React.FC<{ item: BaseItemDto; libraryId: string; }&EditableItemProps&StyleLayoutProps> = (props) => {
	const combined = {...{px: ".25em", py: ".25em" } as StyleLayoutProps, ...props as StyleLayoutProps};
	const rating = [props.item.CustomRating, props.item.OfficialRating].coalesce("", Nullable.StringHasValue);

	if (props.isEditing && Nullable.HasValue(props.editableItem) && Nullable.HasValue(props.libraryId)) {
		return (
			<Layout direction="row" {...combined} minWidth="10rem" backgroundColor="AlternatePanel" bt br bb bl>
				<Loading
					receivers={[ItemEditorService.Instance.MetadataInfo]} whenError={() => <></>}
					whenLoading={<LoadingIcon alignSelf="center" size="1em" />} whenNotStarted={<LoadingIcon alignSelf="center" size="1em" />}
					whenReceived={(metadata) =>
						<AutoCompleteFieldEditor
							allOptions={metadata.ParentalRatingOptions?.map((r) => r.Name ?? "") ?? []}
							field={props.editableItem!.OfficialRating}
							getLabel={(v) => v}
							getValue={(v) => v ?? ""}
							getKey={v => v}
						/>
					}
				/>
			</Layout>
		);
	}

	return Nullable.StringValue(rating, <></>, (r) => <Layout direction="row" fontSizeREM={1.5} {...combined} backgroundColor="AlternatePanel" bt br bb bl children={r} />);
};
