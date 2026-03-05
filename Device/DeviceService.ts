import { Linq } from "Common/MissingJavascriptFunctions";
import { Browser } from "Device/Browser";

export class DeviceService {
	public get DeviceId(): string {
		return this._deviceId ?? (this._deviceId = this.FindOrGenerateDeviceId());
	}

	public get DeviceName(): string {
		return this._deviceName ?? (this._deviceName = this.CreateDeviceName());
	}

	private FindOrGenerateDeviceId(): string {
		const localStorageDeviceId = window.localStorage.getItem(this._deviceKey);

		if (localStorageDeviceId !== null) {
			return localStorageDeviceId;
		}

		const keys = [];

		keys.push(navigator.userAgent);
		keys.push(new Date().getTime());

		const deviceId = btoa(keys.join('|')).replaceAll('=', '1');
		window.localStorage.setItem(this._deviceKey, deviceId);
		return deviceId;
	}

	private CreateDeviceName(): string {
		let deviceName = Linq.First(this._browsersToCheck, (c) => c.checkFunc()).name;

		if (Browser.ipad) {
			deviceName += " iPad";
		} else if (Browser.iphone) {
			deviceName += " iPhone";
		} else if (Browser.android) {
			deviceName += " Android";
		}

		return deviceName;
	}

	private _browsersToCheck: BrowserNameCheck[] = [
		{ checkFunc: () => Browser.tizen, name: "Samsung Smart TV" },
		{ checkFunc: () => Browser.web0s, name: "LG Smart TV" },
		{ checkFunc: () => Browser.operaTv, name: "Opera TV" },
		{ checkFunc: () => Browser.xboxOne, name: "Xbox One" },
		{ checkFunc: () => Browser.ps4, name: "Sony PS4" },
		{ checkFunc: () => Browser.chrome, name: "Chrome" },
		{ checkFunc: () => Browser.edgeChromium, name: "Edge Chromium" },
		{ checkFunc: () => Browser.edge, name: "Edge" },
		{ checkFunc: () => Browser.firefox, name: "Firefox" },
		{ checkFunc: () => Browser.opera, name: "Opera" },
		{ checkFunc: () => Browser.safari, name: "Safari" },
		{ checkFunc: () => true, name: "Web Browser" },
	]

	private _deviceName: string|undefined;
	private _deviceId: string|undefined;
	private _deviceKey = "_deviceId2";

	static get Instance(): DeviceService {
		return this._instance ?? (this._instance = new DeviceService());
	}

	private static _instance: DeviceService;
}

interface BrowserNameCheck {
	checkFunc: () => boolean;
	name: string;
}
