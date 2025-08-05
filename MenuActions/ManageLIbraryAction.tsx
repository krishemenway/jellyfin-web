import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";
import { Layout } from "Common/Layout";
import { CenteredModal } from "Common/Modal";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";

const IsOpen = new Observable(false);

export const ManageLibraryAction: ItemMenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "ManageLibrary",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { IsOpen.Value = true; },
	modal: (items) => <Modal items={items} />,
}

const Modal: React.FC<{ items: BaseItemDto[] }> = (props) => {
	const isOpen = useObservable(IsOpen);

	return (
		<CenteredModal open={isOpen} onClosed={() => { IsOpen.Value = false; }}>
			<Layout direction="column">Manage Library</Layout>
			Item Count: {props.items.length}
		</CenteredModal>
	);
};