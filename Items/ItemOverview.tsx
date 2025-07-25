import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Layout } from "Common/Layout"
import { Nullable } from "Common/MissingJavascriptFunctions"

export const ItemOverview: React.FC<{ item: BaseItemDto }> = (props) => {
	if (!Nullable.HasValue(props.item.Overview) || props.item.Overview.length === 0) {
		return <></>;
	}

	return (
		<Layout direction="row" fontSize="12px" className={`${props.item.Type}-overview`}>
			{props.item.Overview}
		</Layout>
	);
};
