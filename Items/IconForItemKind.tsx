import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { BaseItemKindServiceFactory } from "./BaseItemKindServiceFactory";
import { QuestionMarkIcon } from "Common/QuestionMarkIcon";

export const IconForItemKind : React.FC<{ itemKind?: BaseItemKind, collectionType?: CollectionType }&IconProps> = (props) => {
	const iconTypeFuncOrDefault = BaseItemKindServiceFactory.FindOrNull(props.itemKind)?.findIcon ?? ((iconProps) => <QuestionMarkIcon {...iconProps} />);
	return iconTypeFuncOrDefault(props, props.collectionType);
}
