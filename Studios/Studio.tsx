import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ItemService } from "Items/ItemsService";
import { NotFound } from "Common/NotFound";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { PageTitle } from "Common/PageTitle";
import { ListOf } from "Common/ListOf";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ResponsiveBreakpoint, useBreakpoint } from "AppStyles";
import { ImageShape } from "Items/ItemImage";

export const Studio: React.FC = () => {
	const breakpoint = useBreakpoint();
	const studioId = useParams().studioId;

	if (!Nullable.HasValue(studioId)) {
		return <PageWithNavigation icon="Studio"><NotFound /></PageWithNavigation>;
	}

	const studioData = ItemService.Instance.FindOrCreateItemData(studioId);

	React.useEffect(() => studioData.LoadItemWithAbort(), [studioId]);
	React.useEffect(() => studioData.LoadChildrenWithAbort(false, { recursive: true, studioIds: [ studioId ] }), [studioId]);

	return (
		<PageWithNavigation icon="Studio">
			<Loading
				receivers={[studioData.Item, studioData.Children]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(studio, items) => (
					<Layout direction="column" gap="1em" py="1em" height="100%">
						<PageTitle text={studio.Name} />

						<ListOf
							items={items}
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
	)
};
