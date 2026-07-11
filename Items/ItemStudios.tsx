import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutProps } from "Common/Layout";
import { ListOf, BaseListProps } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { EditableItemProps } from "Items/EditableItemProps";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Loading } from "Common/Loading";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { MultiSelectEditor } from "Common/SelectFieldEditor";

export const ItemStudios: React.FC<{ item: BaseItemDto; linkLayout?: StyleLayoutProps, linkClasses?: string[] }&EditableItemProps&BaseListProps> = (props) => {
	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <EditItemStudios {...props} />;
	}

	return (
		<ListOf
			items={props.item.Studios ?? []}
			forEachItem={(studio, index) => <HyperLink key={studio.Id ?? index.toString()} to={`/Studio/${studio.Id}`} direction="row" {...props.linkLayout} classes={props.linkClasses} children={studio.Name} />}
			showMoreButtonStyles={props.linkLayout}
			{...props}
		/>
	);
};

const EditItemStudios: React.FC<{ linkLayout?: StyleLayoutProps }&EditableItemProps&BaseListProps> = (props) => {
	if (!Nullable.HasValue(props.libraryId)) {
		throw new Error("Missing libraryId!");
	}

	const studioList = ItemService.Instance.FindOrCreateListFromSource({ DataSource: "Studios", DataSourceKey: props.libraryId });
	React.useEffect(() => studioList.LoadWithAbort(), [studioList]);

	return (
		<Loading
			receivers={[studioList.List]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="1em" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="1em" />}
			whenReceived={(studios) => (
				<MultiSelectEditor
					field={props.editableItem!.Studios}
					allOptions={studios.List}
					getLabel={(v) => v.Name}
					getValue={(v) => v.Name!}
					createNew={(v) => ({ Id: undefined, Name: v })}
				/>
			)}
		/>
	);
};
