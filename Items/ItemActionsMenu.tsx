import * as React from "react";
import { ListOf } from "Common/ListOf";
import { AnchoredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { ItemActionsIcon } from "Items/ItemActionsIcon";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { StyleLayoutProps } from "Common/Layout";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { useNavigate } from "react-router-dom";

export interface ItemActionProps extends StyleLayoutProps {
	className?: string;
	actions: ItemMenuAction[][];
	user: UserDto;
	filteredItems: readonly BaseItemDto[];
	selectedItems?: readonly BaseItemDto[];
	reloadItems: () => void;
}

export const ItemActionsMenu: React.FC<ItemActionProps> = (props) => {
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => setOpenAnchor(null);
	const navigate = useNavigate();

	const filteredActions = React.useMemo(() => {
		return props.actions
			.map((group) => group.filter((action) => Nullable.Value(action.visible, () => true, a => a)(props.user, props.filteredItems)))
			.filter((group) => group.length > 0);
	}, [props.user, props.actions]);

	if (filteredActions.length === 0) {
		return <></>;
	}

	return (
		<>
			<Button
				type="button" onClick={(element) => setOpenAnchor(element)}
				icon={<ItemActionsIcon />}
				alignItems="center" px=".5em" py=".5em" {...props}
			/>

			{filteredActions.flat().map((action) => Nullable.Value(action.modal, undefined, (m) => m(props.filteredItems)))}

			<AnchoredModal alternatePanel anchorAlignment="center" opensInDirection="left" anchorElement={anchor} open={anchor !== null} onClosed={closeNavigation}>
				<ListOf
					items={filteredActions}
					direction="column" gap=".5em"
					forEachItem={(group, index) => (
						<ListOf
							key={index.toString()}
							items={group.filter(((a) => (a.visible ?? (() => true))(props.user, props.filteredItems)))}
							direction="column"
							forEachItem={(action) => (
								<Button
									key={action.textKey}
									type="button" onClick={() => { closeNavigation(); action.action(props.selectedItems ?? props.filteredItems, navigate, props.reloadItems, props.filteredItems); }}
									direction="row" px=".5em" py=".5em" gap=".5em" alignItems="center"
									icon={action.icon({ size: "1em" })}
									label={action.textKey}
								/>
							)}
						/>
					)}
				/>
			</AnchoredModal>
		</>
	);
};
