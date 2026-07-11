import { SortByString } from "Common/ArrayPrototype";
import { ItemSortType } from "ItemList/ItemSortType";

export const SortByAlbum: ItemSortType = {
	labelKey: "Album",
	field: "Album",
	getContent: (i) => i.Album,
	sortFunc: SortByString((i) => i.Album),
};
