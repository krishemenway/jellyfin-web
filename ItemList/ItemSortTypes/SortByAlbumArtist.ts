import { SortByString } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByAlbumArtist: ItemSortType = {
	labelKey: "AlbumArtist",
	field: "AlbumArtist",
	getContent: (i) => i.AlbumArtist,
	sortFunc: SortByString((i) => i.AlbumArtist),
};
