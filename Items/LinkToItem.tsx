import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { HyperLink } from "Common/HyperLink";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";

export function useUrlToItem(item: BaseItemDto, afterUrl?: string): string {
	const findUrlForItemFuncOrDefault = BaseItemKindServiceFactory.FindOrNull(item.Type)?.findUrl ?? ((item) => `/${item.Type?.toString()}/${item.Id}`);
	return findUrlForItemFuncOrDefault(item) + (afterUrl ?? "");
}

interface LinkToItemProps extends StyleLayoutPropsWithRequiredDirection {
	item: BaseItemDto;
	afterUrl?: string;
	classes?: string[];
	children: React.ReactNode;
	onClick?: () => void;
	onDragStart?: (evt: React.DragEvent<HTMLElement>) => void;
}

export const LinkToItem: React.FC<LinkToItemProps> = ({ item, afterUrl, ...props }) => {
	const url = useUrlToItem(item, afterUrl);
	return <HyperLink to={url} {...props} />;
};
