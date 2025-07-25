import * as React from "react";
import { Nullable } from "./MissingJavascriptFunctions";

export enum ResponsiveBreakpoint {
	Mobile = 1,
	Tablet = 2,
	Desktop = 3,
}

export const ResponsiveBreakpointContext = React.createContext(ResponsiveBreakpoint.Desktop);

export function useResponsiveBreakpoint(): ResponsiveBreakpoint {
	const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 979px)");
	const isDesktop = useMediaQuery("(min-width: 980px)", true);

	if (isDesktop) {
		return ResponsiveBreakpoint.Desktop;
	}

	return isTablet ? ResponsiveBreakpoint.Tablet : ResponsiveBreakpoint.Mobile;
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
