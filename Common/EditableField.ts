import { Computed, Observable } from "@residualeffect/reactor";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";

export interface IEditableField {
	FieldId: string;

	HasChanged: Computed<boolean>;
	ErrorMessage: Computed<string|undefined>;

	CanMakeRequest(): boolean;
	Revert(): void;
	OnSaved(): void;
}

export function ValueIsRequired(value: string|undefined|null): string|undefined {
	return !Nullable.StringHasValue(value) ? "ValueIsRequiredMessage" : undefined;
}

export class EditableField<T> implements IEditableField {
	constructor(fieldId: string, defaultValue: T, getRequestBlockingErrorFunc?: (current: T) => string|undefined, beforeChange?: (newValue: T) => T) {
		this.FieldId = fieldId;
		this.GetRequestBlockingErrorFunc = getRequestBlockingErrorFunc ?? (() => undefined);
		this.BeforeChange = beforeChange ?? ((newValue) => newValue);

		this.Saved = new Observable(defaultValue);
		this.Current = new Observable(this.Saved.Value);

		this.HasChanged = new Computed(() => this.Current.Value !== this.Saved.Value);
		this.ServerErrorMessage = new Observable(undefined);

		this.ErrorMessage = new Computed<string|undefined>(() => Linq.Coalesce([this.GetRequestBlockingErrorFunc(this.Current.Value), this.ServerErrorMessage.Value], "", m => Nullable.StringHasValue(m)));
	}

	public CanMakeRequest(): boolean {
		return !Nullable.StringHasValue(this.GetRequestBlockingErrorFunc(this.Current.Value));
	}

	public OnChange(newValue: T) {
		this.Current.Value = this.BeforeChange(newValue);
		this.ServerErrorMessage.Value = undefined;
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
		this.ServerErrorMessage.Value = "";
	}

	public FieldId: string;
	public BeforeChange: (newValue: T) => T;

	public Current: Observable<T>;
	public Saved: Observable<T>;
	public HasChanged: Computed<boolean>;
	public ServerErrorMessage: Observable<string|undefined>;

	public ErrorMessage: Computed<string|undefined>;

	private GetRequestBlockingErrorFunc: (current: T) => string|undefined;
}
