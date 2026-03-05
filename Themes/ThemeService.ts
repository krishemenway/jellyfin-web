import { Computed } from "@residualeffect/reactor";
import { Theme, ButtonStates, ButtonState } from "Themes/Theme";
import { Dark } from "Themes/Dark";
import { Light } from "Themes/Light";
import { EditableField } from "Common/EditableField";

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
