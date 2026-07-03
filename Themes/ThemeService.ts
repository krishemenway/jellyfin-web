import { Computed } from "@residualeffect/reactor";
import { Theme, ButtonStates, ButtonState } from "Themes/Theme";
import { Dark } from "Themes/Dark";
import { Light } from "Themes/Light";
import { EditableField } from "Common/EditableField";
import { Property } from "csstype";

export type ThemeFontColors = "Primary"|"Secondary"|"Error";
export type ThemeBackgroundColors = "Page"|"BackdropSuppressor"|"Panel"|"AlternatePanel"|"Field"|"TableOddRow"|"Error";

export class ThemeService {
	constructor() {
		this.ThemeField = new EditableField("LabelTheme", this.AllThemes[0]);
		this.CurrentTheme = new Computed(() => this.ThemeField.Current.Value);
	}

	public ApplyThemeToCssVariables(theme: Theme): void {
		const root = window.document.querySelector(":root") as HTMLElement;

		root.style.setProperty("--PageBackgroundColor", theme.PageBackgroundColor);
		root.style.setProperty("--BackdropSuppressorColor", theme.BackdropSuppressorColor);
		root.style.setProperty("--FontFamily", theme.FontFamily);

		root.style.setProperty("--PanelBackgroundColor", theme.PanelBackgroundColor);
		root.style.setProperty("--PanelBorderColor", theme.PanelBorderColor);

		root.style.setProperty("--AlternateBackgroundColor", theme.AlternateBackgroundColor);
		root.style.setProperty("--AlternateBorderColor", theme.AlternateBorderColor);

		root.style.setProperty("--FieldBackgroundColor", theme.FieldBackgroundColor);
		root.style.setProperty("--FieldBorderColor", theme.FieldBorderColor);

		root.style.setProperty("--PrimaryTextColor", theme.PrimaryTextColor);
		root.style.setProperty("--SecondaryTextColor", theme.SecondaryTextColor);
		root.style.setProperty("--ErrorTextColor", theme.ErrorTextColor);

		root.style.setProperty("--TableOddRowBackgroundColor", theme.TableOddRowBackgroundColor);

		this.ApplyButtonStatesCssVariables(root, "Button", theme.Button);
		this.ApplyButtonStatesCssVariables(root, "ButtonSelected", theme.ButtonSelected);
	}

	public ConvertFontColor(color?: ThemeFontColors): Property.Color|undefined {
		switch (color) {
			case undefined:
				return undefined;
			case "Primary":
				return "var(--PrimaryTextColor)";
			case "Secondary":
				return "var(--SecondaryTextColor)";
			case "Error":
				return "var(--ErrorTextColor)";
		}
	}

	public ConvertBackgroundColor(color?: ThemeBackgroundColors): Property.BackgroundColor|undefined {
		switch (color) {
			case undefined:
				return undefined;
			case "Page":
				return "var(--PageBackgroundColor)";
			case "BackdropSuppressor":
				return "var(--BackdropSuppressorColor)";
			case "Panel":
				return "var(--PanelBackgroundColor)";
			case "AlternatePanel":
				return "var(--AlternateBackgroundColor)";
			case "Field":
				return "var(--FieldBackgroundColor)";
			case "Error":
				return "var(--FieldBackgroundColor)";
			case "TableOddRow":
				return "var(--TableOddRowBackgroundColor)";
		}
	}

	public ConvertBorderColor(color?: ThemeBackgroundColors): Property.BackgroundColor|undefined {
		switch (color) {
			case undefined:
				return undefined;
			case "Page":
				return undefined;
			case "BackdropSuppressor":
				return undefined;
			case "Panel":
				return "var(--PanelBorderColor)";
			case "AlternatePanel":
				return "var(--AlternateBorderColor)";
			case "Field":
				return "var(--FieldBorderColor)";
			case "Error":
				return "var(--ErrorTextColor)";
			case "TableOddRow":
				return undefined;
		}
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
		Dark,
		Light,
	]

	public CurrentTheme: Computed<Theme>;
	public ThemeField: EditableField<Theme>;

	static get Instance(): ThemeService {
		return this._instance ?? (this._instance = new ThemeService());
	}

	private static _instance: ThemeService;
}
