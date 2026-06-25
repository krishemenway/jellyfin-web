import * as React from "react";
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

export function useTranslatedText(request: TranslationRequest|undefined): string|undefined {
	const translations = useDataOrNull(TranslationService.Instance.Translations);

	if (translations === null || !Nullable.HasValue(request)) {
		return undefined;
	}

	let textFromStore = translations[request.Key];

	if (Nullable.HasValue(textFromStore) && Nullable.HasValue(request.KeyProps)) {
		request.KeyProps.forEach((tp, i) => { textFromStore = textFromStore.replace(`{${i}}`, tp)})
	}

	return textFromStore;
}

interface TranslatedTextProps {
	textKey: string;
	textProps?: string[];
	formatText?: (translatedText?: string) => string;
	elementType?: string;
	layout?: StyleLayoutProps;
	className?: string
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ textKey, textProps, formatText, className, elementType, layout }) => {
	let translated = useTranslatedText({ Key: textKey, KeyProps: textProps });

	if (translated === undefined) {
		console.warn(`Missing text key: '${textKey}'`);
	}

	if (formatText !== undefined) {
		translated = formatText(translated);
	}

	if (elementType !== undefined) {
		return React.createElement(elementType, { className: className, style: ApplyLayoutStyleProps(layout) }, <>{translated}</>);
	} else {
		return <>{translated}</>;
	}
};

export const RequiresTranslationsLoaded: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Loading
		receivers={[TranslationService.Instance.Translations]}
		whenError={() => <></>} whenLoading={<></>} whenNotStarted={<></>}
		whenReceived={() => React.Children.map(children, (c) => c)}
	/>
);
