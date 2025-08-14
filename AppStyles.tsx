import * as React from "react";
import { createUseStyles } from "react-jss";
import { Nullable } from "Common/MissingJavascriptFunctions";

export enum ResponsiveBreakpoint {
	Mobile = 1,
	Tablet = 2,
	Desktop = 3,
}

const Context = React.createContext(ResponsiveBreakpoint.Desktop);

export function useBreakpoint(): ResponsiveBreakpoint {
	return React.useContext(Context);
}

export function useBreakpointValue<T>(valuesByBreakpoint: Record<ResponsiveBreakpoint, T>) {
	const breakpoint = useBreakpoint();
	return valuesByBreakpoint[breakpoint];
}

export function useCalculatedBreakpoint(): [ResponsiveBreakpoint, React.Provider<ResponsiveBreakpoint>] {
	const isTablet = useMediaQuery("(min-width: 40em) and (max-width: 69.9999999em)");
	const isDesktop = useMediaQuery("(min-width: 70em)", true);

	if (isDesktop) {
		return [ResponsiveBreakpoint.Desktop, Context.Provider];
	}

	return isTablet ? [ResponsiveBreakpoint.Tablet, Context.Provider] : [ResponsiveBreakpoint.Mobile, Context.Provider];
}

function useMediaQuery(query: string, defaultValue?: boolean): boolean {
	const getDefaultSnapshot = React.useCallback(() => defaultValue ?? false, [defaultValue]);
	const getServerSnapshot = React.useMemo(() => () => matchMedia(query).matches, [getDefaultSnapshot, query, matchMedia]);

	const [getSnapshot, subscribe] = React.useMemo(() => {
		if (!Nullable.HasValue(matchMedia)) {
			return [getDefaultSnapshot, () => () => {}];
		}

		const list = matchMedia(query);
		return [() => list.matches, (notify: () => void) => { list.addEventListener('change', notify); return () => { list.removeEventListener('change', notify); }; } ];
	}, [getDefaultSnapshot, matchMedia, query]);

	return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const createStyles = createUseStyles;
export const useGlobalStyles = createUseStyles({
	"@global": {
		[`html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del,
		dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label,
		legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed,  figure, figcaption, footer, header, hgroup,
		menu, nav, output, ruby, section, summary, time, mark, audio, video, button, text, tspan, input`]: {
			color: "var(--PrimaryTextColor)",
			fill: "var(--PrimaryTextColor)",
			borderWidth: "1px",
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
		"tbody tr:nth-child(odd)": {
			background: "var(--TableOddRowBackgroundColor)",
		},
	},
});

export const useBackgroundStyles = createUseStyles({
	error: {
		color: "var(--ErrorTextColor)",
	},
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
	dashed: {
		border: "1px dashed var(--PanelBorderColor)",
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
		// Fighting with nth-child(odd) precedence
		"body.jellyfin-base &": {
			cursor: "pointer",
			background: "var(--ButtonSelectedIdleBackgroundColor)",
			border: "1px solid var(--ButtonSelectedIdleBorderColor)",
			color: "var(--ButtonSelectedIdleTextColor)",

			"&:hover": {
				background: "var(--ButtonSelectedHoverBackgroundColor)",
				border: "1px solid var(--ButtonSelectedHoverBorderColor)",
				color: "var(--ButtonSelectedHoverTextColor)",
			},

			"&:disabled": {
				cursor: "not-allowed",
				background: "var(--ButtonSelectedDisabledBackgroundColor)",
				border: "1px solid var(--ButtonSelectedDisabledBorderColor)",
				color: "var(--ButtonSelectedDisabledTextColor)",
			},
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
