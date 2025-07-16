import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import ListOf from "Common/ListOf";

const ItemStudios: React.FC<{ item: BaseItemDto }> = (props) => {
	return (
		<ListOf
			items={props.item.Studios ?? []}
			createKey={(s, i) => s.Id ?? s.Name ?? i.toString()}
			renderItem={(s) => <>{s.Name}</>}
		/>
	);
};

export default ItemStudios;
