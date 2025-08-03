import { Computed, Observable } from "@residualeffect/reactor";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";

export class SelectField<TOptionType> {
	constructor(fieldId: string, allOptions: TOptionType[], defaultValue?: TOptionType, canMakeRequestFunc?: () => string, beforeChange?: (newValue: TOptionType) => TOptionType) {
		this.FieldId = fieldId;
		this.CanMakeRequestFunc = canMakeRequestFunc ?? (() => "");
		this.BeforeChange = beforeChange ?? ((newValue) => newValue);

		this.AllOptions = allOptions;

		this.Saved = new Observable(defaultValue ?? this.AllOptions[0]);
		this.Current = new Observable(this.Saved.Value);

		this.HasChanged = new Computed(() => this.Current.Value !== this.Saved.Value);
		this.ServerErrorMessage = new Observable("");

		this.ErrorMessage = new Computed(() => Linq.Coalesce([this.CanMakeRequestFunc()], this.ServerErrorMessage.Value));
	}

	public CanMakeRequest(): boolean {
		return !Nullable.HasValue(this.CanMakeRequestFunc());
	}

	public OnChange(newValue: TOptionType) {
		this.Current.Value = this.BeforeChange(newValue);
	}

	public OnSaved(): void {
		this.Saved.Value = this.Current.Value;
	}

	public FieldId: string;
	public BeforeChange: (newValue: TOptionType) => TOptionType;

	public AllOptions: TOptionType[];

	public Current: Observable<TOptionType>;
	public Saved: Observable<TOptionType>;

	public HasChanged: Computed<boolean>;
	public ServerErrorMessage: Observable<string>;

	public ErrorMessage: Computed<string>;

	private CanMakeRequestFunc: () => string;
}
