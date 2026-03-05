import { Theme } from "Themes/Theme";

export const Light: Theme = {
	Name: "Light",
	FontFamily: "Segoe UI",
	PageBackgroundColor: "#F8F8F8",
	BackdropSuppressorColor: "rgba(50, 50, 50, .97)",

	PanelBackgroundColor: "#E0E0E0",
	PanelBorderColor: "#C8C8C8",

	AlternateBackgroundColor: "#D0D0D0",
	AlternateBorderColor: "#C8C8C8",

	FieldBackgroundColor: "rgba(100, 100, 100, 0.09)",
	FieldBorderColor: "rgba(100, 100, 100, 0.05)",

	PrimaryTextColor: "rgba(0, 0, 0, 0.8)",
	SecondaryTextColor: "rgba(50, 50, 50, 0.8)",
	ErrorTextColor: "#c51244",

	TableOddRowBackgroundColor: "rgba(255, 255, 255, 0.05)",

	Button: {
		Idle: {     BackgroundColor: "rgba(10, 10, 10, 0.09)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.05)" },
		Disabled: { BackgroundColor: "rgba(10, 10, 10, 0.09)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.05)" },
		Hover: {    BackgroundColor: "rgba(10, 10, 10, 0.30)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.05)" },
	},

	ButtonSelected: {
		Idle: {     BackgroundColor: "rgba(10, 10, 10, 0.20)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.10)" },
		Disabled: { BackgroundColor: "rgba(10, 10, 10, 0.09)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.05)" },
		Hover: {    BackgroundColor: "rgba(10, 10, 10, 0.30)", TextColor: "rgba(0, 0, 0, 0.8)", BorderColor: "rgba(10, 10, 10, 0.05)" },
	},
};
