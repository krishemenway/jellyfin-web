export class Linq {
	public static Swap<T>(array: T[], indexA: number, indexB: number): T[] {
		const valueA = array[indexA];
		const valueB = array[indexB];

		array[indexA] = valueB;
		array[indexB] = valueA;

		return array;
	}

	public static ToggleItem<T>(array: T[], item: T): T[] {
		const index = array.indexOf(item);

		if (index > -1) {
			array.splice(index, 1);
			return array;
		} else {
			return array.concat([item]);
		}
	}

	public static GroupBy<TKey extends string|number|symbol, TValue>(array: TValue[], keyFunc: (arrayValue: TValue) => TKey): Record<TKey, TValue[]> {
		return array.reduce((grouped, current) => {
			const key = keyFunc(current);
			grouped[key] = grouped[key] ?? [];
			grouped[key].push(current);
			return grouped;
		}, {} as Record<TKey, TValue[]>);
	}

	public static ToRecord<TValue, TKey extends string|number|symbol = string>(array: TValue[], getKey: (value: TValue) => TKey): Record<TKey, TValue> {
		return array.reduce((all, current) => { all[getKey(current)] = current; return all; }, {} as Record<TKey, TValue>);
	}

	public static Distinct<T>(array: T[]): T[] {
		return array.filter((value, index) => array.indexOf(value) === index);
	}

	public static SelectMany<T, T2>(array: readonly T[], select: (t: T) => T2[]): T2[] {
		return array.reduce((all, current) => { all.push(...select(current)); return all; }, [] as T2[]);
	}

	public static First<T>(array: readonly T[], matchFunc?: (t: T) => boolean): T {
		const result = Nullable.Value(matchFunc, array, (match) => array.filter(match));
		return result[0];
	}

	public static Single<T>(array: readonly T[], matchFunc?: (t: T) => boolean): T {
		const result = Nullable.Value(matchFunc, array, (match) => array.filter(match));

		if (result.length !== 1) {
			throw new Error(`Tried to search array expecting exactly one item and found ${result.length} items`)
		}

		return result[0];
	}

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

	public static Coalesce<T>(values: (T|undefined|null)[], defaultValue: T, hasValueFunc?: (value: T|undefined|null) => boolean): T {
		return values.find((v) => (hasValueFunc ?? Nullable.HasValue)(v)) ?? defaultValue;
	}

	public static Sequence(from: number, count: number): number[] {
		return [...Array(count).keys()].map((v) => v + from);
	}
}

export class Nullable {
	public static HasValue<T>(value: T|undefined|null) {
		return value !== null && value !== undefined;
	}

	public static StringHasValue(value: string|undefined|null) {
		return this.HasValue(value) && value.length > 0;
	}

	public static TryExecute<T>(value: T|undefined|null, action: (value: T) => void, otherwise?: () => void) {
		if (Nullable.HasValue(value)) {
			action(value);
		} else if (Nullable.HasValue(otherwise)) {
			otherwise();
		}
	}

	public static Value<T, T2>(obj: T|undefined|null, defaultValue: T2, valueSelector: (o: T) => T2): T2 {
		return Nullable.HasValue(obj) ? valueSelector(obj) : defaultValue;
	}

	public static StringValue<T>(value: string|undefined|null, defaultValue: T, modify?: (v: string) => T): T {
		const modifyOrDefault = modify ?? ((v: string) => v as T);
		return Nullable.HasValue(value) && value.length > 0 ? modifyOrDefault(value) : defaultValue;
	}
}

export class Bytes {
	public static ConvertSize(sizeInBytes?: number|null): string|undefined {
		if (!Nullable.HasValue(sizeInBytes)) {
			return undefined;
		}

		if (sizeInBytes < 2048) {
			return `${sizeInBytes}B`;
		}

		const sizeInKB = sizeInBytes / 1024;
		if (sizeInKB < 2048) {
			return `${sizeInKB.toFixed(2)}KB`;
		}

		const sizeInMB = sizeInKB / 1024;
		if (sizeInMB < 2048) {
			return `${sizeInMB.toFixed(2)}MB`;
		}

		const sizeInGB = sizeInMB / 1024;
		return `${sizeInGB.toFixed(2)}GB`;
	}

	public static ConvertRate(rateInBits?: number|null) {
		if (!Nullable.HasValue(rateInBits)) {
			return undefined;
		}

		if (rateInBits < 2048) {
			return `${rateInBits}bps`;
		}

		const rateInKilo = rateInBits / 1000;
		if (rateInKilo < 2048) {
			return `${rateInKilo.toFixed(2)}kbps`;
		}

		const rateInMega = rateInKilo / 1000;
		if (rateInMega < 2048) {
			return `${rateInMega.toFixed(2)}mbps`;
		}

		const rateInGiga = rateInMega / 1000;
		return `${rateInGiga.toFixed(2)}gbps`;
	}
}

export class NumberLimits {
	public static NoLessThan(value: number, noLessThanValue: number, valueWhenLessThan?: number) {
		if (value < noLessThanValue) {
			return valueWhenLessThan ?? noLessThanValue;
		}

		return value;
	}

	public static NoGreaterThan(value: number, noGreaterThanValue: number, valueWhenGreaterThan?: number) {
		if (value > noGreaterThanValue) {
			return valueWhenGreaterThan ?? noGreaterThanValue;
		}

		return value;
	}
}

export class DateTime {
	public static ParseWithoutZone(date: string): Date {
		if (date.endsWith("Z")) {
			return new Date(date.slice(0, date.length - 2));
		}

		const lastDash = date.lastIndexOf("-");
		return new Date(date.slice(0, lastDash));
	}

	public static ToTicks(seconds?: number, minutes?: number, hours?: number): number|undefined {
		let ticks: number|undefined = undefined;

		if (Nullable.HasValue(seconds)) {
			ticks = (ticks ?? 0) + seconds * this.TicksPerSecond;
		}

		if (Nullable.HasValue(minutes)) {
			ticks = (ticks ?? 0) + minutes * this.TicksPerMinute;
		}

		if (Nullable.HasValue(hours)) {
			ticks = (ticks ?? 0) + hours * this.TicksPerHour;
		}

		return ticks;
	}

	public static ConvertTicksToDurationString(ticks: number|null|undefined): string {
		const parts = [];

		if (!Nullable.HasValue(ticks)) {
			return "";
		}

		let hours = ticks / DateTime.TicksPerHour;
		hours = Math.floor(hours);

		if (hours) {
			parts.push(hours.toLocaleString());
			ticks -= (hours * DateTime.TicksPerHour);
		}

		let minutes = ticks / DateTime.TicksPerMinute;
		minutes = Math.floor(minutes);

		if (minutes < 10 && hours) {
			parts.push((0).toLocaleString() + minutes.toLocaleString());
			ticks -= (minutes * DateTime.TicksPerMinute);
		} else {
			parts.push(minutes.toLocaleString());
			ticks -= (minutes * DateTime.TicksPerMinute);
		}

		let seconds = ticks / DateTime.TicksPerSecond;
		seconds = Math.floor(seconds);

		if (seconds < 10) {
			parts.push((0).toLocaleString() + seconds.toLocaleString());
		} else {
			parts.push(seconds.toLocaleString());
		}

		return parts.join(':');
	}

	public static TicksPerSecond = 10000000;
	public static TicksPerMinute = DateTime.TicksPerSecond * 60;
	public static TicksPerHour = DateTime.TicksPerMinute * 60;
}
