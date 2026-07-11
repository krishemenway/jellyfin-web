import * as React from "react";
import { BaseItemKind, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { IconForItemKind, IconForItemCollection } from "Items/IconForItemKind";
import { Layout } from "Common/Layout";
import { PageWithNavigation } from "PageWithNavigation";

export const Icons: React.FC = () => {
	return (
		<PageWithNavigation icon="Unknown" content={() => (
			<Layout direction="column" alignItems="center" py="1rem" gap="3rem">
				<Layout direction="column" gap=".5rem">
					<Layout direction="row">Item Types</Layout>
					<ListOf
						direction="row" wrap gap="2em"
						items={Object.keys(BaseItemKind).map((t) => t as BaseItemKind).filter((i) => i !== "CollectionFolder")}
						forEachItem={(kind) => (
							<Layout key={kind} direction="column" alignItems="center" grow basis={0}>
								<IconForItemKind itemKind={kind} size="2em" />
								<Layout direction="row">{kind}</Layout>
							</Layout>
						)}
					/>
				</Layout>

				<Layout direction="column" gap=".5rem">
					<Layout direction="row">Collection Types</Layout>
					<ListOf
						items={Object.keys(CollectionType).map((c) => c.toLowerCase() as CollectionType)}
						direction="row" wrap gap="2em"
						forEachItem={(collectionType) => (
							<Layout key={collectionType} direction="column" alignItems="center" grow basis={0}>
								<IconForItemCollection collectionType={collectionType} size="2em" />
								<Layout direction="row">{collectionType}</Layout>
							</Layout>
						)}
					/>
				</Layout>
			</Layout>
		)} />
	);
};
