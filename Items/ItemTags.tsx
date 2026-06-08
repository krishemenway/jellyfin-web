import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { TagLink } from "Tags/TagLink";
import { EditableItemProps } from "Items/EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { useDataOrNull } from "Common/Loading";
import { ItemFilterService } from "Items/ItemFilterService";
import { FieldLabel } from "Common/FieldLabel";
import { TranslatedText } from "Common/TranslatedText";

export const ItemTags: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string; libraryId?: string }&EditableItemProps&BaseListProps> = (props) => {
	const tags = Nullable.Value(props.libraryId, [], (lid) => useDataOrNull(ItemFilterService.Instance.FindOrCreateFiltersReceiver([lid]))?.Tags ?? []);

	React.useEffect(() => Nullable.TryExecute(props.libraryId, (lid) => ItemFilterService.Instance.LoadFiltersWithAbort([lid])), [props.libraryId]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return (
			<Layout direction="row" gap=".5em" alignItems="center">
				<FieldLabel field={props.editableItem!.Tags} />
				<MultiSelectEditor
					field={props.editableItem.Tags}
					allOptions={tags}
					getLabel={(tag) => tag}
					getValue={(tag) => tag ?? ""}
					createNew={(tag) => tag}
				/>
			</Layout>
		);
	}

	if ((props.item.Tags ?? []).length > 0) {
		return (
			<Layout direction="row" gap=".5em">
				<Layout direction="row" px=".25em" py=".25em"><TranslatedText textKey="Tags" /></Layout>
				<ListOf
					items={props.item.Tags ?? []}
					forEachItem={(tag) => <TagLink key={tag} tag={tag} direction="row" {...props.linkLayout} className={props.linkClassName} />}
					showMoreButtonStyles={props.linkLayout}
					{...props}
				/>
			</Layout>
		);
	}

	return undefined;
};
