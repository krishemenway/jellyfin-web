export function ArrayMin<T>(array: T[], valueSelector: (t: T) => any): T|null {
	if (array.length === 0) {
		return null;
	}

	return array.reduce((lowest, current) => {
		return lowest === null || valueSelector(current) < valueSelector(lowest) ? current : lowest;
	}, null as T|null);
}

export function ArrayMax<T>(array: T[], valueSelector: (t: T) => any): T|null {
	if (array.length === 0) {
		return null;
	}

	return array.reduce((lowest, current) => {
		return lowest === null || valueSelector(current) > valueSelector(lowest) ? current : lowest;
	}, null as T|null);
}
