import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { TagLink } from "Tags/TagLink";
import { EditableItem } from "./EditableItem";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { ItemFilterService } from "Items/ItemFilterService";

export const ItemTags: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string; isEditing: boolean; itemEditor?: EditableItem; libraryId: string }&BaseListProps> = (props) => {
	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort([props.libraryId]), [props.libraryId]);

	if (props.isEditing && Nullable.HasValue(props.itemEditor)) {
		return (
			<Loading
				receivers={[ItemFilterService.Instance.FindOrCreateFiltersReceiver([props.libraryId])]}
				whenError={() => <></>}
				whenLoading={<LoadingIcon alignSelf="center" size="1em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="1em" />}
				whenReceived={(filters) => 
					Nullable.HasValue(props.itemEditor?.OfficialRating) ? (
						<MultiSelectEditor
							allOptions={filters.Tags ?? []}
							field={props.itemEditor.Tags}
							getLabel={(v) => v}
							getValue={(v) => v ?? ""}
							
						/>
					) : <></>
				}
			/>
		);
	}

	return (
		<ListOf
			items={props.item.Tags ?? []}
			forEachItem={(tag) => <TagLink key={tag} tag={tag} direction="row" {...props.linkLayout} className={props.linkClassName} />}
			showMoreButtonStyles={props.linkLayout}
			{...props}
		/>
	);
};
