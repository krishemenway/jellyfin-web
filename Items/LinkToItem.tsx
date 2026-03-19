import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { HyperLink } from "Common/HyperLink";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";

export function useUrlToItem(item: BaseItemDto, afterUrl?: string): string {
	const findUrlForItemFuncOrDefault = BaseItemKindServiceFactory.FindOrNull(item.Type)?.findUrl ?? ((item) => `/${item.Type?.toString()}/${item.Id}`);
	return findUrlForItemFuncOrDefault(item) + (afterUrl ?? "");
}

export const LinkToItem: React.FC<{ item: BaseItemDto; afterUrl?: string; className?: string; children: React.ReactNode; onClick?: () => void; }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	const url = useUrlToItem(props.item, props.afterUrl);
	return <HyperLink to={url} {...props} />;
};
