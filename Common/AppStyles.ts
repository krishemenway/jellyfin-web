import { createUseStyles } from "react-jss";

export const createStyles = createUseStyles;

export const useGlobalStyles = createUseStyles({
	"@global": {
		[`html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del,
		dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label,
		legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed,  figure, figcaption, footer, header, hgroup,
		menu, nav, output, ruby, section, summary, time, mark, audio, video, button, text, tspan, input`]: {
			color: "var(--PrimaryTextColor)",
			fill: "var(--PrimaryTextColor)",
			borderWidth: "0",
			borderColor: "var(--PanelBorderColor)",
			borderStyle: "none",
			margin: "0",
			padding: "0",
			fontSize: "100%",
			font: "inherit",
			verticalAlign: "baseline",
			boxSizing: "border-box",
			fontFamily: "var(--FontFamily),Arial,sans-serif",
			background: "transparent",
			textDecoration: "none",
		},
		"input": {
			boxSizing: "content-box",
		},
		"html": {
			lineHeight: 1,
			background: "var(--PageBackgroundColor)",
			height: "100%",
		},
		"body": {
			overflowY: "scroll",
			width: "100%",
			height: "100%",
		},
		"ol, ul": {
			listStyle: "none",
		},
		"table": {
			borderCollapse: "collapse",
			borderSpacing: 0,
		},
	},
});

export const useBackgroundStyles = createUseStyles({
	panel: {
		background: "var(--PanelBackgroundColor)",
		border: "1px solid var(--PanelBorderColor)",
	},
	alternatePanel: {
		background: "var(--AlternateBackgroundColor)",
		border: "1px solid var(--AlternateBorderColor)",
	},
	field: {
		background: "var(--FieldBackgroundColor)",
		border: "1px solid var(--FieldBorderColor)",
	},
	button: {
		cursor: "pointer",
		background: "var(--ButtonIdleBackgroundColor)",
		border: "1px solid var(--ButtonIdleBorderColor)",
		color: "var(--ButtonIdleTextColor)",

		"&:hover": {
			background: "var(--ButtonHoverBackgroundColor)",
			border: "1px solid var(--ButtonHoverBorderColor)",
			color: "var(--ButtonHoverTextColor)",
		},

		"&:disabled": {
			cursor: "not-allowed",
			background: "var(--ButtonDisabledBackgroundColor)",
			border: "1px solid var(--ButtonDisabledBorderColor)",
			color: "var(--ButtonDisabledTextColor)",
		},
	},
	selected: {
		cursor: "pointer",
		background: "var(--SelectedButtonIdleBackgroundColor)",
		border: "1px solid var(--SelectedButtonIdleBorderColor)",
		color: "var(--SelectedButtonIdleTextColor)",

		"&:hover": {
			background: "var(--SelectedButtonHoverBackgroundColor)",
			border: "1px solid var(--SelectedButtonHoverBorderColor)",
			color: "var(--SelectedButtonHoverTextColor)",
		},

		"&:disabled": {
			cursor: "not-allowed",
			background: "var(--SelectedButtonDisabledBackgroundColor)",
			border: "1px solid var(--SelectedButtonDisabledBorderColor)",
			color: "var(--SelectedButtonDisabledTextColor)",
		},
	},
	transparent: {
		cursor: "pointer",
		background: "transparent",
		border: "1px solid transparent",
		color: "var(--ButtonIdleTextColor)",

		"&:hover": {
			background: "var(--ButtonHoverBackgroundColor)",
			border: "1px solid var(--ButtonHoverBorderColor)",
			color: "var(--ButtonHoverTextColor)",
		},

		"&:disabled": {
			cursor: "not-allowed",
			background: "var(--ButtonDisabledBackgroundColor)",
			border: "1px solid var(--ButtonDisabledBorderColor)",
			color: "var(--ButtonDisabledTextColor)",
		},
	},
});
