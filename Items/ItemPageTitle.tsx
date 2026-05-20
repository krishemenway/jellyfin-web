import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { useDataOrNull } from "Common/Loading";
import { Layout } from "Common/Layout";
import { EditableItemProps } from "Items/EditableItemProps";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { TextField } from "Common/TextField";

export const ItemPageTitle: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	const server = useDataOrNull(ServerService.Instance.ServerInfo);

	React.useEffect(() => { document.title = props.item.Name + Nullable.Value(server, "", (s) => ` | ${s.ServerName}`); }, [props.item, server]);

	return props.isEditing && Nullable.HasValue(props.editableItem)
		? <TextField field={props.editableItem.Name} fontSizeREM={1.75} grow px=".25em" />
		: <Layout direction="row" fontSizeREM={1.75} elementType="h1">{props.item.Name}</Layout>;
};
