import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { PageTitle } from "Common/PageTitle";
import { Loading } from "Common/Loading";
import { useBreakpointValues } from "AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { ItemsGridItem } from "ItemList/ItemGridItem";

export const Genre: React.FC = () => {
	const genresPerRow = useBreakpointValues(2, 6, 9, 9);
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
									itemsPerRow={genresPerRow}
								/>
							)}
						/>
					)}
				/>
			</Layout>
		</PageWithNavigation>
	)
};
