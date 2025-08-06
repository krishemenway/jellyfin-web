import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { RefreshIcon } from "CommonIcons/RefreshIcon";
import { Layout } from "Common/Layout";
import { CenteredModal } from "Common/Modal";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";

const IsOpen = new Observable(false);

export const RefreshItemAction: ItemMenuAction = {
	icon: (p) => <RefreshIcon {...p} />,
	textKey: "Refresh",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { IsOpen.Value = true; },
	modal: (items) => <Modal key={"RefreshItemAction" + items.map((i) => i.Id).join("")} items={items} />,
}

const Modal: React.FC<{ items: BaseItemDto[] }> = (props) => {
	const isOpen = useObservable(IsOpen);

	return (
		<CenteredModal open={isOpen} onClosed={() => { IsOpen.Value = false; }}>
			<Layout direction="column">Refresh Item</Layout>
			Item Count: {props.items.length}
		</CenteredModal>
	);
};
