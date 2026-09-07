import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { Computed, Observable } from "@residualeffect/reactor";
import { Loading, useDataOrNull } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import * as defaultLanguage from "strings/en-us.json";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

export interface TranslationRequest {
	Key: string;
	KeyProps?: string[];
}

export class TranslationService {
	constructor() {
		this.CurrentCulture = new Observable<string>(this.DefaultLanguage());
		this.Translations = new Receiver("Failed to load translations");
		this.UseRTL = new Computed<boolean>(() => this.RTLLanguages.indexOf(this.CurrentCulture.Value) > -1);
		this.Translations.Start(() => new Promise((resolve) => { resolve(defaultLanguage); }));
	}

	public Translations: Receiver<Record<string, string>>;
	public CurrentCulture: Observable<string>;
	public UseRTL: Computed<boolean>;

	private DefaultLanguage(): string {
		const culture = window.document.documentElement.getAttribute('data-culture');

		if (culture) {
			return culture;
		}

		if (navigator.language) {
			return navigator.language;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const internetExplorerNavigator = navigator as any;
		if (internetExplorerNavigator.userLanguage !== undefined && typeof internetExplorerNavigator.userLanguage === "string") {
			return internetExplorerNavigator.userLanguage;
		}

		if (navigator.languages?.length) {
			return navigator.languages[0];
		}

		return this.FallbackCulture;
	}

	private FallbackCulture = 'en-us';
	private RTLLanguages = ['ar', 'fa', 'ur', 'he'];

	static get Instance(): TranslationService {
		return this._instance ?? (this._instance = new TranslationService());
	}

	private static _instance: TranslationService;
}

export function useTranslatedText(request: TranslationRequest|undefined|string): string|undefined {
	const translations = useDataOrNull(TranslationService.Instance.Translations);

	if (translations === null || !Nullable.HasValue(request)) {
		return undefined;
	}

	const keyProps = typeof request === "string" ? undefined : request.KeyProps;
	let textFromStore = translations[typeof request === "string" ? request : request.Key];

	if (Nullable.HasValue(textFromStore) && Nullable.HasValue(keyProps)) {
		keyProps.forEach((tp, i) => { textFromStore = textFromStore.replace(`{${i}}`, tp)})
	}

	return textFromStore;
}

export function useTranslatedNumber(numberValue: number, formatOptions?: Intl.NumberFormatOptions): string {
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const translated = React.useMemo(() => new Intl.NumberFormat(culture, formatOptions).format(numberValue), [culture, numberValue, formatOptions]);

	return translated;
}

export function useTranslatedDate(date?: Date, formatOptions?: Intl.DateTimeFormatOptions): string {
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const formattedDate = React.useMemo(() => Nullable.Value(date, "", (d) => new Intl.DateTimeFormat(culture, formatOptions).format(d)), [culture, date]);

	return formattedDate;
}

export function useTranslatedDuration(duration: Partial<Record<Intl.DurationFormatUnit, number>>, durationFormat?: Intl.DurationFormatOptions): string {
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const translated = React.useMemo(() => new Intl.DurationFormat(culture, durationFormat).format(duration), [culture, duration, durationFormat]);

	return translated;
}

interface TranslatedTextProps {
	textKey: string|TranslationRequest;
	textProps?: string[];
	formatText?: (translatedText?: string) => string;
	elementType?: string;
	layout?: StyleLayoutProps;
	classes?: string[];
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ textKey, textProps, formatText, classes, elementType, layout }) => {
	textProps = typeof textKey === "string" ? textProps : textKey.KeyProps;
	textKey = typeof textKey === "string" ? textKey : textKey.Key;

	let translated = useTranslatedText({ Key: textKey, KeyProps: textProps });

	if (translated === undefined) {
		console.warn(`Missing text key: '${textKey}'`);
	}

	if (formatText !== undefined) {
		translated = formatText(translated);
	}

	if (elementType !== undefined) {
		return React.createElement(elementType, { className: classes?.join(" "), style: ApplyLayoutStyleProps(layout) }, <>{translated}</>);
	} else {
		return <>{translated}</>;
	}
};

export const TranslatedDate: React.FC<{ date?: Date, classes?: string[]; elementType?: string; layout?: StyleLayoutProps; formatText?: (translatedText?: string) => string; }&Intl.DateTimeFormatOptions> = ({ date, classes, elementType, layout, formatText, ...props }) => {
	let formattedDate = useTranslatedDate(date, props);

	if (formatText !== undefined) {
		formattedDate = formatText(formattedDate);
	}

	if (elementType !== undefined) {
		return React.createElement(elementType, { className: classes?.join(" "), style: ApplyLayoutStyleProps(layout) }, <>{formattedDate}</>);
	} else {
		return <>{formattedDate}</>;
	}
};

export const TranslatedDuration: React.FC<{ classes?: string[]; elementType?: string; layout?: StyleLayoutProps; duration: Partial<Record<Intl.DurationFormatUnit, number>>; durationFormat?: Intl.DurationFormatOptions; formatText?: (translatedText?: string) => string; }> = ({ classes, elementType, layout, duration, durationFormat, formatText }) => {
	let formattedDuration = useTranslatedDuration(duration, durationFormat);

	if (formatText !== undefined) {
		formattedDuration = formatText(formattedDuration);
	}

	if (elementType !== undefined) {
		return React.createElement(elementType, { className: classes?.join(" "), style: ApplyLayoutStyleProps(layout) }, <>{formattedDuration}</>);
	} else {
		return <>{formattedDuration}</>;
	}
};

export const TranslatedNumber: React.FC<{ classes?: string[]; elementType?: string; layout?: StyleLayoutProps; numberValue: number; numberFormat?: Intl.NumberFormatOptions; formatText?: (translatedText?: string) => string; }> = ({ classes, elementType, layout, numberValue, numberFormat, formatText }) => {
	let formattedNumber = useTranslatedNumber(numberValue, numberFormat);

	if (formatText !== undefined) {
		formattedNumber = formatText(formattedNumber);
	}

	if (elementType !== undefined) {
		return React.createElement(elementType, { className: classes?.join(" "), style: ApplyLayoutStyleProps(layout) }, <>{formattedNumber}</>);
	} else {
		return <>{formattedNumber}</>;
	}
};

export const RequiresTranslationsLoaded: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Loading
		receivers={[TranslationService.Instance.Translations]}
		whenError={() => <></>} whenLoading={<></>} whenNotStarted={<></>}
		whenReceived={() => React.Children.map(children, (c) => c)}
	/>
);
