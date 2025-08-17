import * as React from "react";
import { ItemMenuAction } from "Items/ItemMenuAction";
import { EditIcon } from "CommonIcons/EditIcon";
import { CenteredModal } from "Common/Modal";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useObservable } from "@residualeffect/rereactor";
import { FieldLabel } from "Common/FieldLabel";
import { ListOf } from "Common/ListOf";
import { Button } from "Common/Button";
import { TextField } from "Common/TextField";
import { FieldError } from "Common/FieldError";
import { Form } from "Common/Form";
import { ItemEditorService } from "Items/ItemEditorService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { RequestError } from "Common/RequestError";
import { useError } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import { Layout } from "Common/Layout";
import { TranslatedText } from "Common/TranslatedText";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { CloseIcon } from "CommonIcons/CloseIcon";

export const EditItemAction: ItemMenuAction = {
	icon: (p) => <EditIcon {...p} />,
	textKey: "Edit",
	visible: (user) => user.Policy?.IsAdministrator ?? false,
	action: () => { ItemEditorService.Instance.IsOpen.Value = true; },
	modal: (items) => <Modal key={"EditItemAction" + items.map((i) => i.Id).join("")} items={items} />,
}

const Modal: React.FC<{ items: BaseItemDto[] }> = (props) => {
	const isOpen = useObservable(ItemEditorService.Instance.IsOpen);

	React.useEffect(() => { ItemEditorService.Instance.Load(props.items[0]); }, [props.items, isOpen])

	return (
		<CenteredModal open={isOpen} onClosed={() => { ItemEditorService.Instance.IsOpen.Value = false; }} minWidth="30em" maxWidth="40em">
			<ItemEditor />

			{props.items.length > 1 && (
				<ListOf
					direction="row"
					items={props.items}
					forEachItem={(item) => <Button type="button" onClick={() => ItemEditorService.Instance.Load(item)} children={item.Name} />}
				/>
			)}
		</CenteredModal>
	);
};

const ItemEditor: React.FC = () => {
	const showErrors = useObservable(ItemEditorService.Instance.ShowErrors);
	const item = useObservable(ItemEditorService.Instance.CurrentEditableItem);
	const error = useError(ItemEditorService.Instance.SaveResult as Receiver<unknown>);

	if (!Nullable.HasValue(item)) {
		return <></>;
	}

	return (
		<Form onSubmit={(() => { ItemEditorService.Instance.Save()})} direction="column" px="1em" py="1em" gap="1em" width="100%" height="100%">
			<Layout direction="row" justifyContent="space-between">
				<TranslatedText textKey="Editor" elementType="div" layout={{ alignItems: "center", fontSize: "1.2em" }} />
				<Button type="button" onClick={() => ItemEditorService.Instance.CurrentEditableItem.Value = undefined} justifyContent="center" icon={<CloseIcon />} py=".5em" px=".5em" />
			</Layout>

			<Layout direction="column" gap=".25em">
				<FieldLabel field={item.Name} />
				<TextField field={item.Name} px=".5em" py=".5em" />
				<FieldError field={item.Name} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".25em">
				<FieldLabel field={item.OriginalTitle} />
				<TextField field={item.OriginalTitle} px=".5em" py=".5em" />
				<FieldError field={item.OriginalTitle} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".25em">
				<FieldLabel field={item.ForcedSortName} />
				<TextField field={item.ForcedSortName} px=".5em" py=".5em" />
				<FieldError field={item.ForcedSortName} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".25em">
				<FieldLabel field={item.Overview} />
				<TextField field={item.Overview} px=".5em" py=".5em" />
				<FieldError field={item.Overview} showErrors={showErrors} />
			</Layout>

			<Layout direction="column" gap=".25em" alignItems="end">
				<RequestError showErrors={showErrors} errorKey={error} />
				<Button type="submit" justifyContent="center" icon={<SaveIcon />} py=".5em" px=".5em" />
			</Layout>
		</Form>
	);
};
