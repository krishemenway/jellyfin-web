import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { ResponsiveBreakpoint, useBreakpointValue } from "AppStyles";
import { ImageShape } from "Items/ItemImage";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { ItemService } from "Items/ItemsService";

const tagsPerRowConfig = { [ResponsiveBreakpoint.Wide]: 9, [ResponsiveBreakpoint.Desktop]: 9, [ResponsiveBreakpoint.Tablet]: 6, [ResponsiveBreakpoint.Mobile]: 2 };

export const Tag: React.FC = () => {
	const tag = useParams().tag;
	const tagsPerRow = useBreakpointValue(tagsPerRowConfig);

	if (!Nullable.HasValue(tag) || tag.length === 0) {
		return <PageWithNavigation icon={<TagIcon />}><NotFound /></PageWithNavigation>;
	}

	// this just needs to be unique, won't be used for loading data for id
	const itemService = ItemService.Instance.FindOrCreateItemData(`Tag-${tag}`);

	React.useEffect(() => itemService.LoadChildrenWithAbort(false, { recursive: true, tags: [tag] }), [tag]);

	return (
		<PageWithNavigation icon={<TagIcon />}>
			<Loading
				receivers={[itemService.Children]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenReceived={(items) => (
					<Layout direction="column" gap="1em" py="1em" height="100%">
						<PageTitle text={tag} />

						<ListOf
							items={items}
							direction="row" wrap gap=".5em"
							forEachItem={(item, index) => (
								<ItemsGridItem
									key={item.Id ?? index.toString()}
									item={item}
									itemsPerRow={tagsPerRow}
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
