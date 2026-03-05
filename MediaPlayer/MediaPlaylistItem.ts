import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export interface MediaPlaylistItem {
	Id: string;
	Item: BaseItemDto;
}
