import { Theme } from "Themes/Theme";

export const Dark: Theme = {
	Name: "Dark",
	FontFamily: "Segoe UI",
	PageBackgroundColor: "#050505",
	BackdropSuppressorColor: "rgba(5, 5, 5, .97)",

	PanelBackgroundColor: "#202020",
	PanelBorderColor: "rgba(255, 255, 255, 0.12)",

	AlternateBackgroundColor: "#303030",
	AlternateBorderColor: "#484848",

	FieldBackgroundColor: "rgba(255, 255, 255, 0.09)",
	FieldBorderColor: "rgba(255, 255, 255, 0.05)",

	PrimaryTextColor: "rgba(255, 255, 255, 0.8)",
	SecondaryTextColor: "rgba(200, 200, 200, 0.8)",
	ErrorTextColor: "#c51244",

	TableOddRowBackgroundColor: "rgba(255, 255, 255, 0.05)",

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
};
