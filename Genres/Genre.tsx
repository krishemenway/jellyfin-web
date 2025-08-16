import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { PageTitle } from "Common/PageTitle";
import { Loading } from "Common/Loading";
import { ResponsiveBreakpoint, useBreakpoint } from "AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ImageShape } from "Items/ItemImage";

export const Genre: React.FC = () => {
	const breakpoint = useBreakpoint();
	const genre = useParams().genre;

	if (!Nullable.HasValue(genre)) {
		return <PageWithNavigation icon="Genre"><NotFound /></PageWithNavigation>;
	}

	const studioData = ItemService.Instance.FindOrCreateItemData(genre);

	React.useEffect(() => studioData.LoadChildrenWithAbort(false, { recursive: true, genres: [ genre ] }), [genre]);
	

	return (
		<PageWithNavigation icon="Genre">
			<Layout direction="column" gap="1em" py="1em" height="100%">
				<PageTitle text={genre} />
				<Loading
					receivers={[studioData.Children]}
					whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
					whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
					whenReceived={(items) => (
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
					)}
				/>
			</Layout>
		</PageWithNavigation>
	)
};
