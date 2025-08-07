import * as React from "react";
import { BaseItemDto, BaseItemKind, ImageType, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { createStyles, useBackgroundStyles, ResponsiveBreakpoint, useBreakpoint } from "AppStyles";
import { Layout } from "Common/Layout";
import { ListOf } from "Common/ListOf";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
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
import { ItemListService } from "ItemList/ItemListService";
import { UserViewStore } from "Users/UserViewStore";
import { PageTitle } from "Common/PageTitle";

export const ItemListView: React.FC<{ paramName: string; itemKind: BaseItemKind }> = (props) => {
	const routeParams = useParams();
	const libraryId = routeParams[props.paramName];
	
	if (!Nullable.HasValue(libraryId)) {
		return <PageWithNavigation icon={props.itemKind}><NotFound /></PageWithNavigation>;
	}

	const itemList = ItemService.Instance.FindOrCreateItemList(libraryId, props.itemKind);

	React.useEffect(() => itemList.LoadWithAbort(), [itemList]);
	React.useEffect(() => SettingsStore.Instance.LoadSettings(libraryId), [libraryId]);

	return (
		<PageWithNavigation icon={props.itemKind}>
			<Loading
				receivers={[itemList.List, SettingsStore.Instance.Settings, LoginService.Instance.User, UserViewStore.Instance.UserViews]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" my="8em" />}
				whenReceived={(items, settings, user, libraries) => <ItemsGrid libraryId={libraryId} itemList={itemList} items={items.List} settings={settings} itemKind={props.itemKind} user={user} libraries={libraries} />}
			/>
		</PageWithNavigation>
	);
};

const ItemsGrid: React.FC<{ libraryId: string, items: BaseItemDto[]; itemList: ItemListService; itemKind: BaseItemKind; settings: Settings; user: UserDto; libraries: BaseItemDto[] }> = (props) => {
	const breakpoint = useBreakpoint();
	const itemKindService = BaseItemKindServiceFactory.FindOrNull(props.itemKind);
	const listOptions = useObservable(props.itemList.ListOptions);
	const library = Linq.Single(props.libraries, (l) => l.Id === props.libraryId);

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
		<Layout direction="column" gap="1em" py="1em">
			<PageTitle text={library?.Name} />
			{listOptions && <ItemListFilters library={library} user={props.user} listOptions={listOptions} />}

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap=".5em"
				forEachItem={(item, index) => (
					<ItemsGridItem
						key={item.Id ?? index.toString()}
						item={item}
						shape={itemKindService?.primaryShape ?? ImageShape.Portrait}
						itemsPerRow={breakpoint === ResponsiveBreakpoint.Desktop ? 9 : breakpoint === ResponsiveBreakpoint.Tablet ? 6 : 2}
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
		<LinkToItem item={props.item} className={`${background.button} ${shapeClass}`} direction="column" justifyContent="center" alignItems="center" py=".5em" px=".5em" gap="1em" width={{ itemsPerRow: props.itemsPerRow, gap: ".5em" }}>
			<ItemImage item={props.item} className={classes.itemImage} type={props.imageType ?? ImageType.Primary} fillWidth={width} fillHeight={height} lazy />
			<Layout direction="column" py=".25em" textAlign="center">{props.item.Name}</Layout>
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
