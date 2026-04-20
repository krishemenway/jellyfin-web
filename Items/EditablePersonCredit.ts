import { BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class EditablePersonCredit {
	constructor(personCredit?: BaseItemPerson) {
		this.Key = (EditablePersonCredit.LastId++).toString();
		this.From = personCredit;

		this.Id = new EditableField("Id", this.From?.Id ?? "", (newId) => ValueIsRequired(newId));
		this.Name = new EditableField("Name", this.From?.Name ?? "", (newName) => ValueIsRequired(newName));
		this.Type = new EditableField("Type", this.From?.Type ?? PersonKind.Unknown, (c) => ValueIsRequired(c));
		this.Role = new EditableField("Role", this.From?.Role ?? "", (newRole) => ValueIsRequired(newRole));
	}

	public AllFields(): IEditableField[] {
		return [
			this.Id,
			this.Name,
			this.Type,
			this.Role,
		];
	}

	public CreateRequest(): BaseItemPerson {
		return {
			Id: this.Id.Current.Value,
			Name: this.Name.Current.Value,
			Type: this.Type.Current.Value,
			Role: this.Role.Current.Value,
		};
	}

	public Key: string;
	public Id: EditableField<string>;
	public Name: EditableField<string>;
	public Role: EditableField<string>;
	public Type: EditableField<PersonKind>;

	public From: BaseItemPerson|undefined;

	private static LastId = 1;
}
