export interface ButtonState {
	BackgroundColor: string;
	TextColor: string;
	BorderColor: string;
}

export interface ButtonStates {
	Idle: ButtonState;
	Hover: ButtonState;
	Disabled: ButtonState;
}

export interface Theme {
	Name: string;
	PageBackgroundColor: string;
	BackdropSuppressorColor: string;

	PanelBackgroundColor: string;
	PanelBorderColor: string;

	AlternateBackgroundColor: string;
	AlternateBorderColor: string;

	FieldBackgroundColor: string;
	FieldBorderColor: string;

	Button: ButtonStates;
	ButtonSelected: ButtonStates;

	PrimaryTextColor: string;
	SecondaryTextColor: string;
	ErrorTextColor: string;

	TableOddRowBackgroundColor: string;

	FontFamily: string;
}
