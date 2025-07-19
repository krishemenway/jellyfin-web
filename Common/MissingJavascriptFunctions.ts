export class Array {
	public static Min<T>(array: T[], valueSelector: (t: T) => string|number|null|undefined): T|null {
		if (array.length === 0) {
			return null;
		}

		return array.reduce((lowest, current) => {
			return lowest === null || (valueSelector(current) ?? "") < (valueSelector(lowest) ?? "") ? current : lowest;
		}, null as T|null);
	}

	public static Max<T>(array: T[], valueSelector: (t: T) => string|number|null|undefined): T|null {
		if (array.length === 0) {
			return null;
		}

		return array.reduce((largest, current) => {
			return largest === null || (valueSelector(current) ?? "") > (valueSelector(largest) ?? "") ? current : largest;
		}, null as T|null);
	}

	public static Coalesce<T>(values: (T|undefined|null)[], defaultValue: T): T {
		return values.find((v) => Nullable.HasValue(v)) ?? defaultValue;
	}
}

export class Nullable {
	public static HasValue<T>(value: T|undefined|null) {
		return value !== null && value !== undefined;
	}
}
