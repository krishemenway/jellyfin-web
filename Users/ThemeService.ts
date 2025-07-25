import { Observable } from "@residualeffect/reactor";

interface ButtonState {
	BackgroundColor: string;
	TextColor: string;
	BorderColor: string;
}

interface ButtonStates {
	Idle: ButtonState;
	Hover: ButtonState;
	Disabled: ButtonState;
}

export interface Theme {
	Name: string;
	PageBackgroundColor: string;

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

	FontFamily: string;
}

export class ThemeService {
	constructor() {
		this.CurrentTheme = new Observable(this.AllThemes[0]);
	}

	public SetTheme(theme: string) {
		this.CurrentTheme.Value = this.AllThemes.find((t) => t.Name === theme) ?? this.AllThemes[0];
	}

	public ApplyThemeToCssVariables(theme: Theme): void {
		const root = window.document.querySelector(":root") as HTMLElement;

		root.style.setProperty("--PageBackgroundColor", theme.PageBackgroundColor);
		root.style.setProperty("--FontFamily", theme.FontFamily);

		root.style.setProperty("--PanelBackgroundColor", theme.PanelBackgroundColor);
		root.style.setProperty("--PanelBorderColor", theme.PanelBorderColor);

		root.style.setProperty("--AlternateBackgroundColor", theme.AlternateBackgroundColor);
		root.style.setProperty("--AlternateBorderColor", theme.AlternateBorderColor);

		root.style.setProperty("--FieldBackgroundColor", theme.FieldBackgroundColor);
		root.style.setProperty("--FieldBorderColor", theme.FieldBorderColor);

		root.style.setProperty("--PrimaryTextColor", theme.PrimaryTextColor);
		root.style.setProperty("--SecondaryTextColor", theme.SecondaryTextColor);

		this.ApplyButtonStatesCssVariables(root, "Button", theme.Button);
		this.ApplyButtonStatesCssVariables(root, "ButtonSelected", theme.ButtonSelected);
	}

	private ApplyButtonStatesCssVariables(root: HTMLElement, name: string, state: ButtonStates): void {
		this.ApplyButtonStateCssVariables(root, `${name}Idle`, state.Idle);
		this.ApplyButtonStateCssVariables(root, `${name}Disabled`, state.Disabled);
		this.ApplyButtonStateCssVariables(root, `${name}Hover`, state.Hover);
	}

	private ApplyButtonStateCssVariables(root: HTMLElement, name: string, state: ButtonState): void {
		root.style.setProperty(`--${name}BackgroundColor`, state.BackgroundColor);
		root.style.setProperty(`--${name}TextColor`, state.TextColor);
		root.style.setProperty(`--${name}BorderColor`, state.BorderColor);
	}

	public AllThemes: Theme[] = [
		{
			Name: "Default",
			FontFamily: "Segoe UI",
			PageBackgroundColor: "#101010",

			PanelBackgroundColor: "#202020",
			PanelBorderColor: "rgba(255, 255, 255, 0.12)",

			AlternateBackgroundColor: "#303030",
			AlternateBorderColor: "#484848",

			FieldBackgroundColor: "rgba(255, 255, 255, 0.09)",
			FieldBorderColor: "rgba(255, 255, 255, 0.05)",

			PrimaryTextColor: "rgba(255, 255, 255, 0.8)",
			SecondaryTextColor: "rgba(200, 200, 200, 0.8)",

			Button: {
				Idle: {     BackgroundColor: "rgba(255, 255, 255, 0.09)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.05)" },
				Disabled: { BackgroundColor: "rgba(255, 255, 255, 0.09)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.05)" },
				Hover: {    BackgroundColor: "rgba(255, 255, 255, 0.30)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.05)" },
			},

			ButtonSelected: {
				Idle: {     BackgroundColor: "rgba(255, 255, 255, 0.20)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.10)" },
				Disabled: { BackgroundColor: "rgba(255, 255, 255, 0.09)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.05)" },
				Hover: {    BackgroundColor: "rgba(255, 255, 255, 0.30)", TextColor: "rgba(255, 255, 255, 0.8)", BorderColor: "rgba(255, 255, 255, 0.05)" },
			},
		}
	]

	public CurrentTheme: Observable<Theme>;

	static get Instance(): ThemeService {
		return this._instance ?? (this._instance = new ThemeService());
	}

	private static _instance: ThemeService;
}
