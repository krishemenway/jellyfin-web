import * as React from "react";
import { Computed, Observable } from "@residualeffect/reactor";
import { useObservable } from "@residualeffect/rereactor";
import { Receiver } from "Common/Receiver";
import * as defaultLanguage from "strings/en-us.json";

class TranslationService {
	constructor() {
		this.CurrentCulture = new Observable<string>(this.DefaultLanguage());
		this.Translations = new Receiver("Failed to load translations");
		this.UseRTL = new Computed<boolean>(() => this.RTLLanguages.indexOf(this.CurrentCulture.Value) > -1);
		this.Translations.Start((_) => new Promise((resolve) => { resolve(defaultLanguage); }));
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

		if ((navigator as any).userLanguage) { // IE Support
			return (navigator as any).userLanguage;
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

export function useTranslatedText(key?: string, textProps?: string[]): string|undefined {
	if (key === undefined || key === "") {
		return textProps?.join(" ") ?? "";
	}

	const translations = useObservable(TranslationService.Instance.Translations.Data);
	if (translations.ReceivedData === null) {
		return undefined;
	}

	let textFromStore = translations.ReceivedData[key];
	if (textProps !== undefined && textProps.length > 0) {
		textProps.forEach((tp, i) => { textFromStore = textFromStore.replace(`{${i}}`, tp)})
	}

	return textFromStore;
}

const TranslatedText: React.FC<{ textKey: string, textProps?: string[] }> = (props) => {
	const translated = useTranslatedText(props.textKey, props.textProps);
	return <>{translated}</>;
}

export default TranslatedText;
