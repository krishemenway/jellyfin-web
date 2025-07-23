export class HomeService {
	static get Instance(): HomeService {
		return this._instance ?? (this._instance = new HomeService());
	}

	private static _instance: HomeService;
}
