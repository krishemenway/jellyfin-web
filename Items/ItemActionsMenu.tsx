import * as React from "react";
import { ListOf } from "Common/ListOf";
import { AnchoredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { ItemActionsIcon } from "Items/ItemActionsIcon";
import { TranslatedText } from "Common/TranslatedText";

export interface ItemAction {
	icon: JSX.Element,
	textKey: string;
	action: () => void;
}

export interface ItemActionProps {
	className?: string;
	actions: ItemAction[][];
}

export const ItemActionsMenu: React.FC<ItemActionProps> = (props) => {
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => setOpenAnchor(null);

	return (
		<>
			<Button className={props.className} alignItems="center" type="button" onClick={(element) => setOpenAnchor(element)}>
				<ItemActionsIcon size={24} />
			</Button>

			<AnchoredModal alternatePanel anchorAlignment={{ horizontal: "left", vertical: "bottom" }} anchorElement={anchor} open={anchor !== null} onClosed={closeNavigation}>
				<ListOf
					items={props.actions ?? []}
					createKey={(_, index) => index.toString()}
					listLayout={{ direction: "row", gap: 8 }}
					renderItem={(group) => (
						<ListOf
							items={group}
							createKey={(a) => a.textKey}
							listLayout={{ direction: "row", gap: 8 }}
							renderItem={(action) => (
								<Button type="button" direction="row" onClick={() => { closeNavigation(); action.action(); }}>
									{action.icon}
									<TranslatedText textKey={action.textKey} />
								</Button>
							)}
						/>
					)}
				/>
			</AnchoredModal>
		</>
	);
};
