import { Computed, FilteredObservable, Observable, RateLimiter, RateLimitType } from "@residualeffect/reactor";
import { Coalesce, HasValue } from "Common/Strings";

export class EditableField {
	constructor(fieldId: string, defaultValue?: string, canMakeRequestFunc?: () => string, beforeChange?: (newValue: string) => string) {
		this.FieldId = fieldId;
		this.CanMakeRequestFunc = canMakeRequestFunc ?? (() => "");
		this.BeforeChange = beforeChange ?? ((newValue) => newValue);

		this.Saved = new Observable<string>(defaultValue ?? "");
		this.Current = new Observable<string>(this.Saved.Value);

		this.HasChanged = new Computed(() => this.Current.Value !== this.Saved.Value);
		this.ServerErrorMessage = new Observable<string>("");

		this.ErrorMessage = new Computed<string>(() => Coalesce([this.CanMakeRequestFunc(), this.ServerErrorMessage.Value]));
	}

	public CanMakeRequest(): boolean {
		return !HasValue(this.CanMakeRequestFunc());
	}

	public OnChange(newValue: string) {
		this.Current.Value = this.BeforeChange(newValue);
	}

	public OnSaved(): void {
		this.Saved.Value = this.Current.Value;
	}

	public SetSaved(value: string) {
		this.Saved.Value = value;
		this.Current.Value = value;
	}

	public FieldId: string;
	public BeforeChange: (newValue: string) => string;

	public Current: Observable<string>;
	public Saved: Observable<string>;
	public HasChanged: Computed<boolean>;
	public ServerErrorMessage: Observable<string>;

	public ErrorMessage: Computed<string>;

	private CanMakeRequestFunc: () => string;
}
