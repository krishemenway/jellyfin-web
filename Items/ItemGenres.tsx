import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { EditableItemProps } from "./EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemFilterService } from "Items/ItemFilterService";
import { Loading } from "Common/Loading";

export const ItemGenres: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClassName?: string }&EditableItemProps&BaseListProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <EditItemGenres {...props} />;
	}

	return (
		<ListOf
			items={props.item.Genres ?? []}
			forEachItem={(genre) => <HyperLink key={genre} to={`/Genres/${genre}`} direction="row" {...props.linkLayout} className={props.linkClassName}>{genre}</HyperLink>}
			showMoreButtonStyles={props.linkLayout}
			{...props}
		/>
	);
};

const EditItemGenres: React.FC<{ linkLayout?: StyleLayoutProps }&EditableItemProps&BaseListProps> = (props) => {
	if (!Nullable.HasValue(props.libraryId)) {
		throw new Error("Missing libraryId!");
	}

	return (
		<Loading
			receivers={[ItemFilterService.Instance.FindOrCreateFiltersReceiver([props.libraryId])]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="1em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="1em" />}
			whenReceived={(filters) => (
				<MultiSelectEditor
					field={props.editableItem!.Genres}
					allOptions={(filters.Genres ?? [])}
					getLabel={(v) => v}
					getValue={(v) => v}
				/>
			)}
		/>
	);
};
