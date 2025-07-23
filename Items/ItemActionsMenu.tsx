import * as React from "react";
import { ListOf } from "Common/ListOf";
import { AnchoredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { ItemActionsIcon } from "Items/ItemActionsIcon";
import { TranslatedText } from "Common/TranslatedText";
import { MenuAction } from "Common/MenuAction";

export interface ItemActionProps {
	className?: string;
	actions: MenuAction[][];
}

export const ItemActionsMenu: React.FC<ItemActionProps> = (props) => {
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => setOpenAnchor(null);

	return (
		<>
			<Button className={props.className} alignItems="center" type="button" onClick={(element) => setOpenAnchor(element)}>
				<ItemActionsIcon size={24} />
			</Button>

			<AnchoredModal alternatePanel opensInDirection="left" anchorElement={anchor} open={anchor !== null} onClosed={closeNavigation}>
				<ListOf
					items={props.actions ?? []}
					direction="column" gap={8}
					forEachItem={(group, index) => (
						<ListOf
							key={index.toString()}
							items={group}
							direction="column"
							forEachItem={(action) => (
								<Button key={action.textKey} type="button" direction="row" onClick={() => { closeNavigation(); action.action(); }} px={8} py={4} gap={8} alignItems="center">
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
