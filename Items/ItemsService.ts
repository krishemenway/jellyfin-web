import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";

export class ItemData {
	constructor(id: string) {
		this.Id = id;
		this.Item = new Receiver("UnknownError");
		this.Children = new Receiver("UnknownError");
	}

	public LoadItemWithAbort(): () => void {
		this.Item.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ ids: [this.Id], fields: ["Overview", "Tags", "ExternalUrls", "Genres", "Studios"] }, { signal: a.signal }).then((response) => (response.data.Items ?? [])[0] ));
		return () => this.Item.AbortWhenLoading();
	}

	public LoadChildrenWithAbort(): () => void {
		this.Children.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ parentId: this.Id }, { signal: a.signal }).then((response) => response.data.Items ?? []));
		return () => this.Children.AbortWhenLoading();
	}

	public Id: string;
	public Item: Receiver<BaseItemDto>;
	public Children: Receiver<BaseItemDto[]>;
}

export class ItemService {
	constructor() {
		this.ItemsForLibrary = {};
	}

	public static UrlForItem(item: BaseItemDto): string {
		switch(item.Type) {
			case "CollectionFolder":
				switch(item.CollectionType) {
					case "movies": return `/Movies/${item.Id}`;
					case "tvshows": return `/Shows/${item.Id}`;
					case "music": return `/Music/${item.Id}`;
					case "musicvideos": return `/MusicVideos/${item.Id}`;
					case "trailers": return `/Trailers/${item.Id}`;
					case "homevideos": return `/HomeVideos/${item.Id}`;
					case "boxsets": return `/Collections/${item.Id}`;
					case "books": return `/Books/${item.Id}`;
					case "photos": return `/Photos/${item.Id}`;
					case "livetv": return `/LiveTV/${item.Id}`;
					case "playlists": return `/Playlists/${item.Id}`;
					case "folders": return `/Folders/${item.Id}`;
					default: throw new Error("Missing url for item " + item.Name);
				}
			case "Series":
				return `/Show/${item.Id}`;
			case "Season":
				return `/Show/${item.SeriesId}/Season/${item.Id}`;
			case "Episode":
				return `/Show/${item.SeriesId}/Episode/${item.Id}`;
			case "MusicAlbum":
				return `/Music/Album/${item.Id}`;
			default:
				return `/${item.Type?.toString()}/${item.Id}`;
		}
	}

	public FindOrCreateItemData(id?: string): ItemData {
		if (id === undefined) {
			throw new Error("Missing id for loading");
		}

		return this.ItemsForLibrary[id] ?? (this.ItemsForLibrary[id] = new ItemData(id));
	}

	public ItemsForLibrary: Record<string, ItemData>;

	static get Instance(): ItemService {
		return this._instance ?? (this._instance = new ItemService());
	}

	private static _instance: ItemService;
}
