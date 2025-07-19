import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { IconForItemType } from "Items/IconForItemType";
import { Layout } from "Common/Layout";

export const Icons: React.FC = () => {
	return (
		<Layout direction="column" alignItems="center" py={32} gap={32}>
			<Layout direction="row">Item Types</Layout>
			<ListOf
				items={Object.keys(BaseItemKind).map((t) => t as BaseItemKind).filter((i) => i !== "CollectionFolder")}
				createKey={(kind) => kind}
				renderItem={(kind) => (
					<Layout direction="column" alignItems="center">
						<IconForItemType itemType={kind} size={32} />
						<Layout direction="row">{kind}</Layout>
					</Layout>
				)}
				listLayout={{ direction: "row", wrap: true, gap: 32, maxWidth: 800 }}
			/>

			<Layout direction="row">Collection Types</Layout>
			<ListOf
				items={Object.keys(CollectionType).map((c) => c as CollectionType)}
				createKey={(collectionType) => collectionType}
				renderItem={(collectionType) => (
					<Layout direction="column" alignItems="center">
						<IconForItemType itemType="CollectionFolder" collectionType={collectionType} size={32} />
						<Layout direction="row">{collectionType}</Layout>
					</Layout>
				)}
				listLayout={{ direction: "row", wrap: true, gap: 32, maxWidth: 800 }}
			/>
		</Layout>
	);
};
