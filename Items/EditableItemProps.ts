import { EditableItem } from "Items/EditableItem";

export interface EditableItemProps {
	editableItem?: EditableItem;
	libraryId?: string;
	isEditing: boolean;
}
