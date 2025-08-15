import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ItemService } from "Items/ItemsService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { CollectionIcon } from "Collections/CollectionIcon";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Layout } from "Common/Layout";
import { PageTitle } from "Common/PageTitle";
import { ListOf } from "Common/ListOf";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ImageShape } from "Items/ItemImage";
import { ResponsiveBreakpoint, useBreakpoint } from "AppStyles";

export const Collection: React.FC = () => {
	const collectionId = useParams().collectionId;
	const breakpoint = useBreakpoint();
	
	if (!Nullable.HasValue(collectionId) || collectionId.length === 0) {
		return <PageWithNavigation icon={<CollectionIcon />}><NotFound /></PageWithNavigation>;
	}

	const collectionService = ItemService.Instance.FindOrCreateItemData(collectionId);

	React.useEffect(() => collectionService.LoadItemWithAbort(), [collectionService]);
	React.useEffect(() => collectionService.LoadChildrenWithAbort(), [collectionService]);

	return (
		<PageWithNavigation icon="BoxSet">
			<Loading
				receivers={[collectionService.Item, collectionService.Children]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenReceived={(collection, collectionItems) => (
					<Layout direction="column" gap="1em" py="1em" height="100%">
						<PageTitle text={collection.Name} />

						<Layout fontSize="1.4em" elementType="h1" direction="row">{collection.Name}</Layout>

						<ListOf
							items={collectionItems}
							direction="row" wrap gap=".5em"
							forEachItem={(item, index) => (
								<ItemsGridItem
									key={item.Id ?? index.toString()}
									item={item}
									itemsPerRow={breakpoint === ResponsiveBreakpoint.Desktop ? 9 : breakpoint === ResponsiveBreakpoint.Tablet ? 6 : 2}
									shape={ImageShape.Portrait}
								/>
							)}
						/>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};
