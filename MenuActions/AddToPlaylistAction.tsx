import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { AddToPlaylistIcon } from "Playlists/AddToPlaylistIcon";
import { Layout } from "Common/Layout";
import { CenteredModal } from "Common/Modal";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";

const IsOpen = new Observable(false);

export const AddToPlaylistAction: ItemMenuAction = {
	icon: (p) => <AddToPlaylistIcon {...p} />,
	textKey: "AddToPlaylist",
	action: () => { IsOpen.Value = true; },
	modal: (items) => <Modal items={items} />,
}

const Modal: React.FC<{ items: BaseItemDto[] }> = (props) => {
	const isOpen = useObservable(IsOpen);

	return (
		<CenteredModal open={isOpen} onClosed={() => { IsOpen.Value = false; }}>
			<Layout direction="column">Add to Playlist</Layout>
			Item Count: {props.items.length}
		</CenteredModal>
	);
};
