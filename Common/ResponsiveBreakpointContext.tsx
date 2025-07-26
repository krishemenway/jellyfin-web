import * as React from "react";
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

export function useCalculatedBreakpoint(): [ResponsiveBreakpoint, React.Provider<ResponsiveBreakpoint>] {
	const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 979px)");
	const isDesktop = useMediaQuery("(min-width: 980px)", true);

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
