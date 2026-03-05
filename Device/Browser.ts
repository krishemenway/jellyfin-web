const userAgent = navigator.userAgent.toLowerCase();

export interface BrowserInfo {
	browser: string;
	version: string;
	platform: string;
	versionMajor: number;

	touch: boolean;

	edgeChromium: boolean;
	edge: boolean;
	opera: boolean;
	chrome: boolean;
	safari: boolean;
	firefox: boolean;
	mozilla: boolean;

	ipad: boolean;
	iphone: boolean;
	windows: boolean;
	android: boolean;
	osx: boolean;
	ps4: boolean;
	xboxOne: boolean;
	operaTv: boolean;

	hisense: boolean;
	vidaa: boolean;
	edgeUwp: boolean;
	orsay: boolean;

	iOS: boolean;
	iOSVersion: number;

	tizen: boolean;
	tizenVersion: number;

	web0s: boolean;
	web0sVersion: number;

	tv: boolean;
	keyboard: boolean;
	mobile: boolean;
	animate: boolean;
}

function isTv() {
	// The OculusBrowsers userAgent also has the samsungbrowser defined but is not a tv.
	if (userAgent.indexOf('oculusbrowser') !== -1) {
		return false;
	}

	if (userAgent.indexOf('tv') !== -1) {
		return true;
	}

	if (userAgent.indexOf('samsungbrowser') !== -1) {
		return true;
	}

	if (userAgent.indexOf('viera') !== -1) {
		return true;
	}

	return isWeb0s();
}

function isWeb0s() {
	return userAgent.indexOf('netcast') !== -1 || userAgent.indexOf('web0s') !== -1;
}

function isMobile() {
	const terms = [
		'mobi',
		'ipad',
		'iphone',
		'ipod',
		'silk',
		'gt-p1000',
		'nexus 7',
		'kindle fire',
		'opera mini'
	];

	for (let i = 0, length = terms.length; i < length; i++) {
		if (userAgent.indexOf(terms[i]) !== -1) {
			return true;
		}
	}

	return false;
}

function tizenVersion(): number {
	const match = RegExp(/Tizen (\d+).(\d+)/).exec(userAgent);

	return match !== null
		? parseInt(match[1], 10) + parseInt(match[2], 10) / 10
		: -1;
}

function iOSversion(): number {
	// MacIntel: Apple iPad Pro 11 iOS 13.1
	if (/iP(hone|od|ad)|MacIntel/.test(navigator.platform)) {
		const tests = [
			// Original test for getting full iOS version number in iOS 2.0+
			/OS (\d+)_(\d+)_?(\d+)?/,
			// Test for iPads running iOS 13+ that can only get the major OS version
			/Version\/(\d+)/
		];

		for (const test of tests) {
			const matches = RegExp(test).exec(navigator.appVersion);
			if (matches) {
				const majorVersion = parseInt(matches[1], 10);
				const minorVersion = parseInt(matches[2] || "0", 10);
				return majorVersion + (minorVersion / 10);
			}
		}
	}

	return -1;
}

function web0sVersion(isChrome: boolean, versionMajor: number): number {
	// Detect webOS version by web engine version

	if (isChrome) {
		if (userAgent.indexOf('netcast') !== -1) {
			// The built-in browser (NetCast) may have a version that doesn't correspond to the actual web engine
			// Since there is no reliable way to detect webOS version, we return an undefined version

			console.warn('Unable to detect webOS version - NetCast');

			return -1;
		}

		// The next is only valid for the app

		if (versionMajor >= 94) {
			return 23;
		} else if (versionMajor >= 87) {
			return 22;
		} else if (versionMajor >= 79) {
			return 6;
		} else if (versionMajor >= 68) {
			return 5;
		} else if (versionMajor >= 53) {
			return 4;
		} else if (versionMajor >= 38) {
			return 3;
		} else if (versionMajor >= 34) {
			// webOS 2 browser
			return 2;
		} else if (versionMajor >= 26) {
			// webOS 1 browser
			return 1;
		}
	} else if (versionMajor >= 538) {
		// webOS 2 app
		return 2;
	} else if (versionMajor >= 537) {
		// webOS 1 app
		return 1;
	}

	console.error('Unable to detect webOS version');

	return -1;
}

export function createBrowser(): BrowserInfo {
	const ua = userAgent.replace(/(motorola edge)/, '').trim();

	const match = /(edg)[ /]([\w.]+)/.exec(ua)
		|| /(edga)[ /]([\w.]+)/.exec(ua)
		|| /(edgios)[ /]([\w.]+)/.exec(ua)
		|| /(edge)[ /]([\w.]+)/.exec(ua)
		|| /(opera)[ /]([\w.]+)/.exec(ua)
		|| /(opr)[ /]([\w.]+)/.exec(ua)
		|| /(chrome)[ /]([\w.]+)/.exec(ua)
		|| /(safari)[ /]([\w.]+)/.exec(ua)
		|| /(firefox)[ /]([\w.]+)/.exec(ua)
		|| ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)
		|| [];

	const versionMatch = /(version)[ /]([\w.]+)/.exec(ua);
	const platformMatch = /(ipad)/.exec(ua)
		|| /(iphone)/.exec(ua)
		|| /(windows)/.exec(ua)
		|| /(android)/.exec(ua)
		|| [];

	const browser = match[1] || '';
	const platform = browser !== 'edge' ? platformMatch[0] || '' : '';

	let version;
	if (versionMatch && versionMatch.length > 2) {
		version = versionMatch[2];
	}

	version = version || match[2] || '0';

	let versionMajor = parseInt(version.split('.')[0], 10);

	if (isNaN(versionMajor)) {
		versionMajor = 0;
	}

	const ps4 = userAgent.indexOf('playstation 4') !== -1;
	const xboxOne = userAgent.indexOf('xbox') !== -1;
	const touch = typeof document !== 'undefined' && ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
	const tv = isTv();
	const edgeChromium = browser === "edg" || browser === "edga" || browser === "edgios";
	const edgeUwp = browser === "edge" && (userAgent.indexOf('msapphost') !== -1 || userAgent.indexOf('webview') !== -1);
	const web0s = isWeb0s();
	const iOS = platform === "ipad" || platform === "iphone";
	const tizen = userAgent.indexOf('tizen') !== -1 || "tizen" in window;

	return {
		browser: browser,
		version: version,
		versionMajor: versionMajor,
		platform: platform,

		ipad: platform === "ipad",
		iphone: platform === "iphone",
		windows: platform === "windows",
		android: platform === "android",
		osx: userAgent.indexOf('mac os x') !== -1,
		ps4: ps4,
		xboxOne: xboxOne,

		iOS: iOS,
		iOSVersion: iOS ? iOSversion() : -1,

		chrome: !web0s && !tizen && browser === "chrome",
		edgeChromium: edgeChromium,
		edge: browser === "edge",
		opera: browser === "opera" || browser === "opr",
		firefox: browser === "firefox",
		mozilla: browser === "mozilla",
		safari: !web0s && !tizen && userAgent.indexOf('webkit') !== -1 && !edgeChromium && browser !== "edge" && browser !== "opera",
		operaTv: isTv() && userAgent.indexOf('opr/') !== -1,

		touch: touch,
		tv: tv,
		keyboard: touch || xboxOne || ps4 || edgeUwp || tv,
		mobile: isMobile(),
		animate: typeof document !== 'undefined' && document.documentElement.animate != null,
		hisense: userAgent.includes('hisense'),
		vidaa: userAgent.includes('vidaa'),
		edgeUwp: edgeUwp,
		orsay: userAgent.indexOf('smarthub') !== -1,

		tizen: tizen,
		tizenVersion: tizen ? tizenVersion() : -1,

		web0s: web0s,
		web0sVersion: web0s ? web0sVersion(!web0s && browser === "chrome", versionMajor) : -1,
	};
};

export const Browser = createBrowser();
