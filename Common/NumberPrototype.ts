declare global {
	interface Number {
		noLessThan(noLessThanValue: number, valueWhenLessThan?: number): number;
		noGreaterThan(noGreaterThanValue: number, valueWhenGreaterThan?: number): number;
	}
}

Number.prototype.noLessThan = function noLessThan(noLessThanValue: number, valueWhenLessThan?: number): number {
	const value = this as number;

	if (value < noLessThanValue) {
		return valueWhenLessThan ?? noLessThanValue;
	}

	return value;
}

Number.prototype.noGreaterThan = function noGreaterThan(noGreaterThanValue: number, valueWhenGreaterThan?: number): number {
	const value = this as number;

	if (value > noGreaterThanValue) {
		return valueWhenGreaterThan ?? noGreaterThanValue;
	}

	return value;
}

export const LoadNumberPrototype = true; // App needs something to reference to be included, it doesn't matter what this is
