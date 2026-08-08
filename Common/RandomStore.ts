export class RandomStore {
	public FindOrCreateRandomValue(id: string|undefined): number {
		if (id === undefined) {
			return 0;
		}

		return this._valuesById[id] ?? (this._valuesById[id] = Math.random());
	}

	private _valuesById: Record<string, number|undefined> = {}

	public static get Instance(): RandomStore {
		return this._instance ?? (this._instance = new RandomStore());
	}

	private static _instance: RandomStore;
}
