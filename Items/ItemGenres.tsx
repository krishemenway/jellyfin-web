import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import Layout from "Common/Layout";
import TranslatedText from "Common/TranslatedText";
import ListOf from "Common/ListOf";
import HyperLink from "Common/HyperLink";

const ItemGenres: React.FC<{ item: BaseItemDto }> = (props) => {
	if ((props.item.Genres?.length ?? 0) === 0) {
		return <></>;
	}

	return (
		<Layout direction="row" gap={16}>
			<Layout direction="row"><TranslatedText textKey="Genres" />:</Layout>
			<ListOf
				items={props.item.Genres ?? []}
				createKey={(t) => t}
				renderItem={(genre) => <HyperLink to={`/Genres/${genre}`} direction="row">{genre}</HyperLink>}
				listLayout={{ direction: "row", gap: 8 }}
			/>
		</Layout>
	)
}

export default ItemGenres;
