import { ItemGroupByType } from "ItemList/ItemGroupByType";

export const GroupByArtist: ItemGroupByType = {
	GroupByType: "Artist",
	TypeLabel: { Key: "Artists" },
	FindKey: (item) => item.Artists ?? ["N/A"],
};

export const GroupByAlbumArtist: ItemGroupByType = {
	GroupByType: "AlbumArtist",
	TypeLabel: { Key: "AlbumArtist" },
	FindKey: (item) => item.AlbumArtists?.map(aa => aa.Name!) ?? ["N/A"],
};
