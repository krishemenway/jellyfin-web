import * as React from "react";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";
import { useDataOrNull } from "Common/Loading";
import { Layout } from "Common/Layout";
import { EditableItem } from "Items/EditableItem";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { ItemEditorService } from "Items/ItemEditorService";
import { TextField } from "Common/TextField";

export const ItemPageTitle: React.FC<{ item: BaseItemDto; itemEditor?: EditableItem }> = (props) => {
	const server = useDataOrNull(ServerService.Instance.ServerInfo);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing)

	React.useEffect(() => { document.title = props.item.Name + Nullable.Value(server, "", (s) => ` | ${s.ServerName}`); }, [props.item, server]);

	return isEditing && Nullable.HasValue(props.itemEditor)
		? <TextField field={props.itemEditor.Name} fontSize="1.75rem" />
		: <Layout direction="row" fontSize="1.75rem" elementType="h1">{props.item.Name}</Layout>;
};
