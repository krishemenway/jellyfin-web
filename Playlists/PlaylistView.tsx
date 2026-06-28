import * as React from "react";
import { useParams } from "react-router-dom";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";

export const PlaylistView: React.FC = () => {
	const playlistId = useParams<{ playlistId: string; }>().playlistId!;

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(playlistId).LoadItemWithAbort(), [playlistId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(playlistId).LoadChildrenWithAbort(true, { recursive: true }), [playlistId]);

	return (
		<PageWithNavigation icon="Playlist" content={(_, user) => (
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(playlistId).Item, ItemService.Instance.FindOrCreateItemData(playlistId).Children]}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(playlist, children) => <LoadedPlaylist playlist={playlist} children={children} user={user} />}
			/>
		)} />
	);
};

const LoadedPlaylist: React.FC<{ playlist: BaseItemDto; children: BaseItemDto[]; user: UserDto  }> = (props) => {
	return <>{props.playlist.Name}</>;
};
