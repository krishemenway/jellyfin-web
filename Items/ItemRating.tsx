import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { EditableItemProps } from "Items/EditableItemProps";
import { LoadingIcon } from "Common/LoadingIcon";
import { ItemFilterService } from "Items/ItemFilterService";
import { Loading } from "Common/Loading";

export const ItemRating: React.FC<{ item: BaseItemDto; libraryId: string; }&EditableItemProps&StyleLayoutProps> = (props) => {
	const background = useBackgroundStyles();
	const combined = {...{fontSize: "1.5em", px: ".25em", py: ".25em" } as StyleLayoutProps, ...props as StyleLayoutProps};
	const rating = Linq.Coalesce([props.item.CustomRating, props.item.OfficialRating], "", (r) => Nullable.StringHasValue(r));

	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort([props.libraryId]), [props.libraryId]);

	if (props.isEditing && Nullable.HasValue(props.libraryId)) {
		return (
			<Layout direction="row" {...combined} className={background.alternatePanel}>
				<Loading
					receivers={[ItemFilterService.Instance.FindOrCreateFiltersReceiver([props.libraryId])]}
					whenError={() => <></>}
					whenLoading={<LoadingIcon alignSelf="center" size="1em" />}
					whenNotStarted={<LoadingIcon alignSelf="center" size="1em" />}
					whenReceived={(filters) => 
						Nullable.HasValue(props.editableItem?.OfficialRating) ? (
							<SelectFieldEditor
								allOptions={filters.OfficialRatings ?? []}
								field={props.editableItem.OfficialRating}
								getLabel={(v) => v}
								getValue={(v) => v ?? ""}
							/>
						) : <></>
					}
				/>
			</Layout>
		);
	}

	return Nullable.StringHasValue(rating)
		? <Layout direction="row" {...combined} className={background.alternatePanel} children={rating} />
		: <></>;
};
