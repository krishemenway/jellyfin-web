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

	public static ValueOrDefault<T, T2>(obj: T|undefined|null, defaultValue: T2, valueSelector: (o: T) => T2): T2 {
		return Nullable.HasValue(obj) ? valueSelector(obj) : defaultValue;
	}
}

export class DateTime {
	public static ConvertTicksToDurationString(ticks: number|null|undefined): string {
		const parts = [];

		if (!Nullable.HasValue(ticks)) {
			return "00:00";
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

	private static TicksPerHour = 36000000000;
	private static TicksPerMinute = 600000000;
	private static TicksPerSecond = 10000000;
}
