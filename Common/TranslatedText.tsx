import * as React from "react";
import { Computed, Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";
import { Receiver } from "Common/Receiver";
import * as defaultLanguage from "strings/en-us.json";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

export interface TranslationRequest {
	Key: string;
	KeyProps?: string[];
}

class TranslationService {
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
	if (!Nullable.HasValue(request)) {
		return undefined;
	}

	const translations = useObservable(TranslationService.Instance.Translations.Data);
	if (translations.ReceivedData === null) {
		return undefined;
	}

	let textFromStore = translations.ReceivedData[request.Key];

	if (request.KeyProps !== undefined && request.KeyProps.length > 0) {
		request.KeyProps.forEach((tp, i) => { textFromStore = textFromStore.replace(`{${i}}`, tp)})
	}

	return textFromStore;
}

export const TranslatedText: React.FC<{ textKey: string, textProps?: string[], formatText?: (translatedText?: string) => string, elementType?: string, layout?: StyleLayoutProps, className?: string }> = (props) => {
	let translated = useTranslatedText({ Key: props.textKey, KeyProps: props.textProps });

	if (props.formatText !== undefined) {
		translated = props.formatText(translated);
	}

	if (props.elementType !== undefined) {
		return React.createElement(props.elementType, { className: props.className, style: ApplyLayoutStyleProps(props.layout) }, <>{translated}</>);
	} else {
		return <>{translated}</>;
	}
}
