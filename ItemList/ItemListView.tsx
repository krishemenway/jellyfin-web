import * as React from "react";
import { BaseItemDto, BaseItemKind, ImageType, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { createStyles, useBackgroundStyles, ResponsiveBreakpoint, useBreakpoint } from "AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { NotFound } from "Common/NotFound";
import { ItemListFilters } from "ItemList/ItemListFilters";
import { ImageShape, ItemImage } from "Items/ItemImage";
import { ItemService } from "Items/ItemsService";
import { LinkToItem } from "Items/LinkToItem";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { Settings, SettingsStore } from "Users/SettingsStore";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { LoginService } from "Users/LoginService";
import { ItemListService, LoadListByPromiseFunc } from "ItemList/ItemListService";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind; loadFunc?: LoadListByPromiseFunc }> = (props) => {
	const routeParams = useParams();
	const libraryId = routeParams[props.paramName];
	const itemList = ItemService.Instance.FindOrCreateItemList(libraryId);

	React.useEffect(() => itemList.LoadWithAbort(props.loadFunc), [itemList, props.loadFunc]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);

	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={props.itemKind}><NotFound /></PageWithNavigation>;
	}

	return (
		<PageWithNavigation icon={props.itemKind}>
			<Loading
				receivers={[itemList.List, SettingsStore.Instance.Settings, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(items, settings, user) => <ItemsGrid id={libraryId} itemList={itemList} items={items} settings={settings} itemKind={props.itemKind} user={user} />}
			/>
		</PageWithNavigation>
	);
};

const ItemsGrid: React.FC<{ id: string, items: BaseItemDto[]; itemList: ItemListService; itemKind: BaseItemKind; settings: Settings; user: UserDto }> = (props) => {
	const breakpoint = useBreakpoint();
	const itemKindService = BaseItemKindServiceFactory.FindOrNull(props.itemKind);
	const listOptions = useObservable(props.itemList.ListOptions);

	const filteredAndSortedItems = useComputed(() => {
		const options = props.itemList.ListOptions.Value;

		if (options === null) {
			return props.items;
		}

		const filterFunc = options.FilterFunc.Value;
		const sortFunc = options.SortByFunc.Value;

		return props.items.filter(filterFunc).sort(sortFunc);
	});

	React.useEffect(() => { props.itemList.LoadItemListViewOptionsOrNew(props.settings, itemKindService); }, [props.settings, itemKindService]);

	return (
		<Layout direction="column" gap={16} py={16}>
			{listOptions && <ItemListFilters user={props.user} listOptions={listOptions} />}

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap={10}
				forEachItem={(item, index) => (
					<ItemsGridItem
						item={item}
						shape={itemKindService?.primaryShape ?? ImageShape.Portrait}
						itemsPerRow={breakpoint === ResponsiveBreakpoint.Desktop ? 9 : breakpoint === ResponsiveBreakpoint.Tablet ? 6 : 2}
						key={item.Id ?? index.toString()}
					/>
				)}
			/>
		</Layout>
	);
};

const ItemsGridItem: React.FC<{ item: BaseItemDto; imageType?: ImageType; shape: ImageShape; itemsPerRow: number }> = (props) => {
	const background = useBackgroundStyles();
	const classes = useItemGridClasses();
	const width = props.shape !== ImageShape.Landscape ? 220 : 330;
	const height = props.shape !== ImageShape.Portrait ? 220 : 330;
	const shapeClass = props.shape === ImageShape.Landscape ? classes.landscape : props.shape == ImageShape.Portrait ? classes.portrait : classes.square;

	return (
		<LinkToItem item={props.item} className={`${background.button} ${shapeClass}`} direction="column" justifyContent="center" alignItems="center" py={8} px={8} gap={16} width={{ itemsPerRow: props.itemsPerRow, gap: 10 }}>
			<ItemImage item={props.item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} lazy />
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
