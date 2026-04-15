import { BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { EditableField, IEditableField, ValueIsRequired } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class EditablePersonCredit {
	constructor(personCredit?: BaseItemPerson) {
		this.Key = (EditablePersonCredit.LastId++).toString();
		this.From = personCredit;

		this.Id = new EditableField("Id", Nullable.Value(this.From, "", p => p.Id ?? ""), (c) => ValueIsRequired(c));
		this.Name = new EditableField("Name", Nullable.Value(this.From, null, p => p.Name), (c) => ValueIsRequired(c));
		this.Type = new EditableField("Type", Nullable.Value(this.From, PersonKind.Unknown, p => p.Type ?? PersonKind.Unknown), (c) => ValueIsRequired(c));
		this.Role = new EditableField("Role", Nullable.Value(this.From, null, p => p.Role), (c) => ValueIsRequired(c));
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
	public Name: EditableField;
	public Role: EditableField;
	public Type: EditableField<PersonKind>;

	public From: BaseItemPerson|undefined;

	private static LastId = 1;
}
