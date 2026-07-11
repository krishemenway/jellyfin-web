import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { useDataOrNull } from "Common/Loading";
import { Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { TextField } from "Common/TextField";
import { ItemFavoriteIcon } from "Items/ItemFavoriteIcon";

export const ItemPageTitle: React.FC<{ item: BaseItemDto; suppressFavorite?: boolean; }&EditableItemProps&LayoutWithoutChildrenProps> = ({ item, editableItem, isEditing, suppressFavorite, ...props }) => {
	const server = useDataOrNull(ServerService.Instance.ServerInfo);

	React.useEffect(() => { document.title = item.Name + Nullable.Value(server, "", (s) => ` | ${s.ServerName}`); }, [item, server]);

	return isEditing && Nullable.HasValue(editableItem)
		? <TextField field={editableItem.Name} fontSizeREM={1.75} grow px=".25em" bt br bb bl backgroundColor="Field" {...props} />
		: <Layout direction="row" fontSizeREM={1.75} elementType="h1" alignItems="center" {...props}>{item.Name}{suppressFavorite !== true && <ItemFavoriteIcon item={item} mx=".5rem" />}</Layout>;
};
