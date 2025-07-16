import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import Layout from "Common/Layout";
import TranslatedText from "Common/TranslatedText";
import ListOf from "Common/ListOf";
import HyperLink from "Common/HyperLink";

const ItemTags: React.FC<{ item: BaseItemDto }> = (props) => {
	if ((props.item.Tags?.length ?? 0) === 0) {
		return <></>;
	}

	return (
		<Layout direction="row" gap={16}>
			<Layout direction="row"><TranslatedText textKey="Tags" />:</Layout>
			<ListOf
				items={props.item.Tags ?? []}
				createKey={(t) => t}
				renderItem={(tag) => <HyperLink to={`/Tags/${tag}`} direction="row">{tag}</HyperLink>}
				listLayout={{ direction: "row", gap: 8 }}
			/>
		</Layout>
	)
}

export default ItemTags;