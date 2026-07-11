import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { QuestionMarkIcon } from "CommonIcons/QuestionMarkIcon";
import { CollectionServiceFactory } from "Collections/CollectionTypeService";
import { Nullable } from "Common/MissingJavascriptFunctions";

export const IconForItemKind : React.FC<{ itemKind: BaseItemKind|undefined, collectionType?: CollectionType }&IconProps> = ({ itemKind, collectionType, ...props }) => {
	return Nullable.Value(BaseItemKindServiceFactory.FindOrNull(itemKind)?.findIcon, <QuestionMarkIcon {...props} /> as React.ReactNode, (findIcon) => findIcon(props, collectionType))
}

export const IconForItemCollection : React.FC<{ collectionType?: CollectionType }&IconProps> = ({ collectionType, ...props }) => {
	return Nullable.Value(CollectionServiceFactory.FindOrNullByCollectionType(collectionType)?.findIcon, <QuestionMarkIcon {...props} /> as React.ReactNode, (findIcon) => findIcon(props));
}
