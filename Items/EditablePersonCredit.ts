import { BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";

export class EditablePersonCredit {
	constructor(personCredit?: BaseItemPerson) {
		this.Key = self.crypto.randomUUID();
		this.From = personCredit;

		this.Id = new EditableField(`Id-${this.Key}`, this.From?.Id);
		this.Name = new EditableField(`Name-${this.Key}`, this.From?.Name ?? "", (newName) => ValueIsRequired(newName));
		this.Type = new EditableField(`Type-${this.Key}`, this.From?.Type ?? PersonKind.Unknown, (c) => ValueIsRequired(c));
		this.Role = new EditableField(`Role-${this.Key}`, this.From?.Role ?? undefined);
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
	public Id: EditableField<string|undefined>;
	public Name: EditableField<string>;
	public Role: EditableField<string|undefined>;
	public Type: EditableField<PersonKind>;

	public From: BaseItemPerson|undefined;
}
