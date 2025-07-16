import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import ListOf from "Common/ListOf";
import HyperLink from "Common/HyperLink";

const ItemExternalLinks: React.FC<{ item: BaseItemDto }> = (props) => {
	return (
		<ListOf
			items={props.item.ExternalUrls ?? []}
			createKey={(url, i) => url.Name ?? i.toString()}
			renderItem={(url) => <HyperLink to={url.Url ?? "/NotFound"} direction="row">{url.Name}</HyperLink>}
			listLayout={{ direction: "row", gap: 8 }}
		/>
	)
}

export default ItemExternalLinks;