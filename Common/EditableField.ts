import { Computed, Observable } from "@residualeffect/reactor";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";

export class EditableField<T = string> {
	constructor(fieldId: string, defaultValue: T, canMakeRequestFunc?: (current: T) => string, beforeChange?: (newValue: T) => T) {
		this.FieldId = fieldId;
		this.CanMakeRequestFunc = canMakeRequestFunc ?? (() => "");
		this.BeforeChange = beforeChange ?? ((newValue) => newValue);

		this.Saved = new Observable(defaultValue);
		this.Current = new Observable(this.Saved.Value);

		this.HasChanged = new Computed(() => this.Current.Value !== this.Saved.Value);
		this.ServerErrorMessage = new Observable("");

		this.ErrorMessage = new Computed<string>(() => Linq.Coalesce([this.CanMakeRequestFunc(this.Current.Value)], this.ServerErrorMessage.Value));
	}

	public CanMakeRequest(): boolean {
		return !Nullable.StringHasValue(this.CanMakeRequestFunc(this.Current.Value));
	}

	public OnChange(newValue: T) {
		this.Current.Value = this.BeforeChange(newValue);
	}

	public OnSaved(): void {
		this.Saved.Value = this.Current.Value;
	}

	public SetSaved(value: T) {
		this.Saved.Value = value;
		this.Current.Value = value;
	}

	public Revert(): void {
		this.Current.Value = this.Saved.Value;
	}

	public FieldId: string;
	public BeforeChange: (newValue: T) => T;

	public Current: Observable<T>;
	public Saved: Observable<T>;
	public HasChanged: Computed<boolean>;
	public ServerErrorMessage: Observable<string>;

	public ErrorMessage: Computed<string>;

	private CanMakeRequestFunc: (current: T) => string;
}
