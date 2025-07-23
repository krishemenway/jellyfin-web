export interface SortFuncs<T> {
	LabelKey: string;
	Sort: (a: T, b: T) => number;
	Reversed: boolean;
}

export function SortByNumber<T>(findNumberFunc: (x: T) => number|undefined|null) {
	return (a: T, b: T) => (findNumberFunc(a) ?? 0) - (findNumberFunc(b) ?? 0);
}

export function SortByString<T>(findStringFunc: (x: T) => string|undefined|null) {
	return (a: T, b: T) => (findStringFunc(a) ?? "").localeCompare(findStringFunc(b) ?? "");
}

export function SortByObjects<T>(items: T[], sortFunctions: SortFuncs<T>[]): T[] {
	return items.sort(SortByObjectsFunc(sortFunctions));
}

export function SortByObjectsFunc<T>(sortFunctions: readonly SortFuncs<T>[]): (a: T, b: T) => number {
	return (a, b) : number => {
		let result = 0;

		// Array.some will quit when returns true
		sortFunctions.some((sortFunc) => {
			result = sortFunc.Sort(a, b);

			if (result === 0) {
				return false;
			}

			result = result * (sortFunc.Reversed ? -1 : 1);
			return true;
		});

		return result;
	};
};
