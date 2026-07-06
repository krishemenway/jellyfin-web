import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { EditableItemProps } from "Items/EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { ItemFilterService } from "Items/ItemFilterService";
import { useDataOrNull } from "Common/Loading";

export const ItemGenres: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClasses?: string[] }&EditableItemProps&BaseListProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <EditItemGenres {...props} />;
	}

	return (
		<ListOf
			items={props.item.Genres ?? []}
			forEachItem={(genre) => <HyperLink key={genre} to={`/Genres/${genre}`} direction="row" {...props.linkLayout} classes={props.linkClasses} children={genre} />}
			showMoreButtonStyles={props.linkLayout}
			{...props}
		/>
	);
};

const EditItemGenres: React.FC<{ linkLayout?: StyleLayoutProps }&EditableItemProps&BaseListProps> = (props) => {
	const genresOrEmpty = Nullable.HasValue(props.libraryId) ? useDataOrNull(ItemFilterService.Instance.FindOrCreateFiltersReceiver([props.libraryId]))?.Genres ?? [] : [];

	return (
		<MultiSelectEditor
			field={props.editableItem!.Genres}
			allOptions={genresOrEmpty}
			getLabel={(v) => v}
			getValue={(v) => v}
			createNew={(v) => v}
		/>
	);
};
