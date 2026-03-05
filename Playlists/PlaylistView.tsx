import * as React from "react";
import { useParams } from "react-router-dom";
import { NotFound } from "Common/NotFound";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { ItemService } from "Items/ItemsService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LoginService } from "Users/LoginService";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";

export const PlaylistView: React.FC = () => {
	const routeParams = useParams<{ playlistId: string; }>();
	const playlistId = routeParams.playlistId;

	if (!Nullable.HasValue(playlistId)) {
		return <PageWithNavigation icon="Playlist"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(playlistId).LoadItemWithAbort(), [playlistId]);
	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(playlistId).LoadChildrenWithAbort(true, { recursive: true }), [playlistId]);

	return (
		<PageWithNavigation icon="Playlist">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(playlistId).Item, ItemService.Instance.FindOrCreateItemData(playlistId).Children, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(playlist, children, user) => <LoadedPlaylist playlist={playlist} children={children} user={user} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedPlaylist: React.FC<{ playlist: BaseItemDto; children: BaseItemDto[]; user: UserDto  }> = (props) => {
	return <>{props.playlist.Name}</>;
};
