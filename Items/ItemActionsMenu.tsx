import * as React from "react";
import { ListOf } from "Common/ListOf";
import { AnchoredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { ItemActionsIcon } from "Items/ItemActionsIcon";
import { TranslatedText } from "Common/TranslatedText";
import { MenuAction } from "Common/MenuAction";
import { StyleLayoutProps } from "Common/Layout";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";

export interface ItemActionProps extends StyleLayoutProps {
	className?: string;
	actions: MenuAction[][];
	user: UserDto;
}

export const ItemActionsMenu: React.FC<ItemActionProps> = (props) => {
	const [anchor, setOpenAnchor] = React.useState<HTMLElement|null>(null);
	const closeNavigation = () => setOpenAnchor(null);

	const filteredActions = React.useMemo(() => {
		return props.actions
			.map((group) => group.filter((action) => Nullable.ValueOrDefault(action.visible, () => true, a => a)(props.user)))
			.filter((group) => group.length > 0);
	}, [props.user, props.actions]);

	if (filteredActions.length === 0) {
		return <></>;
	}

	return (
		<>
			<Button {...props} alignItems="center" type="button" onClick={(element) => setOpenAnchor(element)}>
				<ItemActionsIcon size="1em" />
			</Button>

			<AnchoredModal alternatePanel anchorAlignment="center" opensInDirection="left" anchorElement={anchor} open={anchor !== null} onClosed={closeNavigation}>
				<ListOf
					items={filteredActions}
					direction="column" gap={8}
					forEachItem={(group, index) => (
						<ListOf
							key={index.toString()}
							items={group.filter(((a) => (a.visible ?? (() => true))(props.user)))}
							direction="column"
							forEachItem={(action) => (
								<Button key={action.textKey} type="button" direction="row" onClick={() => { closeNavigation(); action.action(); }} px={8} py={4} gap={8} alignItems="center">
									{action.icon({ size: "1em" })}
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
