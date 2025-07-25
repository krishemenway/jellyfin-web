import * as React from "react";
import { BaseItemDto, BaseItemKind, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { createStyles, useBackgroundStyles } from "Common/AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { ItemListService } from "ItemList/ItemListService";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { ItemService } from "Items/ItemsService";
import { LinkToItem } from "Items/LinkToItem";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { ResponsiveBreakpoint, ResponsiveBreakpointContext } from "Common/ResponsiveBreakpointContext";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = (props) => {
	const routeParams = useParams();
	const libraryId = routeParams[props.paramName];
	const service = ItemService.Instance.FindOrCreateItemList(libraryId);
	const itemKindService = BaseItemKindServiceFactory.FindOrNull(props.itemKind);

	React.useEffect(() => service.LoadWithAbort(), [libraryId]);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation itemKind={props.itemKind}><NotFound /></PageWithNavigation>;
	}

	return (
		<PageWithNavigation itemKind={props.itemKind}>
			<Layout direction="column" gap={16} py={16}>
				<ItemListFilters
					itemId={libraryId} service={service}
					sortOptions={itemKindService?.sortOptions ?? []}
					filterOptions={itemKindService?.filterOptions ?? []}
				/>

				<Loading
					receivers={[service.List]}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
					whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
					whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
					whenReceived={() => <ItemsGrid service={service} shape={itemKindService?.primaryShape ?? ImageShape.Portrait} />}
				/>
			</Layout>
		</PageWithNavigation>
	);
};

const ItemsGrid: React.FC<{ service: ItemListService; imageType?: ImageType; shape: ImageShape }> = (props) => {
	const items = useObservable(props.service.FilteredAndSortedItems);
	const breakpoint = React.useContext(ResponsiveBreakpointContext);
	const itemsPerRow = breakpoint === ResponsiveBreakpoint.Desktop ? 9 : breakpoint === ResponsiveBreakpoint.Tablet ? 6 : 2;

	return (
		<ListOf
			items={items}
			direction="row" wrap gap={10}
			forEachItem={(item, index) => (
				<ItemsGridItem
					item={item}
					imageType={props.imageType}
					shape={props.shape}
					itemsPerRow={itemsPerRow}
					key={item.Id ?? index.toString()}
				/>
			)}
		/>
	);
};

const ItemsGridItem: React.FC<{ item: BaseItemDto; imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();
	const classes = useItemGridClasses();
	const width = props.shape !== ImageShape.Landscape ? 220 : 330;
	const height = props.shape !== ImageShape.Portrait ? 220 : 330;
	const shapeClass = props.shape === ImageShape.Landscape ? classes.landscape : props.shape == ImageShape.Portrait ? classes.portrait : classes.square;

	return (
		<LinkToItem item={props.item} className={`${background.transparent} ${shapeClass}`} direction="column" justifyContent="center" alignItems="center" py={8} px={8} gap={16} width={{ itemsPerRow: props.itemsPerRow, gap: 10 }}>
			<ItemImage item={props.item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} />
			<Layout direction="column" py={4} textAlign="center">{props.item.Name}</Layout>
		</LinkToItem>
	);
}

const useItemGridClasses = createStyles({
	landscape: { },
	portrait: {	},
	square: { },

	itemImage: {
		maxWidth: "100%",
		objectFit: "contain",
	},
});
