export class Nullable {
	public static HasValue<T>(value: T|undefined|null) {
		return value !== null && value !== undefined;
	}

	public static StringHasValue(value: string|undefined|null) {
		return Nullable.HasValue(value) && value.length > 0;
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
