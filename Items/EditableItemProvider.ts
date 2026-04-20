import { EditableField, IEditableField } from "Common/EditableField";

export class EditableItemProvider {
	constructor(key: string, defaultValue?: string|null) {
		this.Key = key;
		this.Value = new EditableField("ItemProvider" + key, defaultValue ?? "");
	}

	public AllFields(): IEditableField[] {
		return [
			this.Value,
		];
	}

	public Key: string;
	public Value: EditableField<string>;
}