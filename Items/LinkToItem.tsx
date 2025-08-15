import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { HyperLink } from "Common/HyperLink";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";

export const LinkToItem: React.FC<{ item: BaseItemDto; afterUrl?: string; className?: string; children: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	const findUrlForItemFuncOrDefault = BaseItemKindServiceFactory.FindOrNull(props.item.Type)?.findUrl ?? ((item) => `/${item.Type?.toString()}/${item.Id}`);
	return <HyperLink to={findUrlForItemFuncOrDefault(props.item) + (props.afterUrl ?? "")} {...props} />;
};
