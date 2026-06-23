import { Nullable } from "Common/MissingJavascriptFunctions";

export const LoadArrayPrototype = true;

declare global {
	interface ReadonlyArray<T> {
		distinct(): Array<T>;
		selectMany<T2 = T>(select: (t: T) => T2[]): T2[];
		groupBy<TKey extends string|number|symbol, TValue = T>(keyFunc: (arrayValue: TValue) => TKey): Record<TKey, TValue[]>;
		toRecord<TKey extends string|number|symbol = string>(getKey: (value: T) => TKey): Record<TKey, T>;
		first(matchFunc?: (t: T) => boolean): T;
		single(matchFunc?: (t: T) => boolean): T;
		max(valueSelector: (t: T) => string|number|null|undefined): T|null;
		min(valueSelector: (t: T) => string|number|null|undefined): T|null;
		coalesce<TIn, TOut>(lastResort: TOut, hasValueFunc?: (value: TIn) => boolean): TOut;
	}

	interface Array<T> {
		swap(indexA: number, indexB: number): Array<T>;
		toggleItem<T>(item: T): T[];
		addCount<T>(count: number, getItem?: (index: number) => T): T[];

		distinct(): Array<T>;
		selectMany<T2 = T>(select: (t: T) => T2[]): T2[];
		groupBy<TKey extends string|number|symbol, TValue = T>(keyFunc: (arrayValue: TValue) => TKey): Record<TKey, TValue[]>;
		toRecord<TKey extends string|number|symbol = string>(getKey: (value: T) => TKey): Record<TKey, T>;
		first(matchFunc?: (t: T) => boolean): T;
		single(matchFunc?: (t: T) => boolean): T;
		max(valueSelector: (t: T) => string|number|null|undefined): T|null;
		min(valueSelector: (t: T) => string|number|null|undefined): T|null;
		coalesce<TIn = T, TOut = T>(lastResort: TOut, hasValueFunc?: (value: TIn) => boolean): TOut;
	}
}

Array.prototype.distinct = function distinct<T>(): T[] {
	const array = this as T[];
	return array.filter((value, index, all) => all.indexOf(value) === index);
}

Array.prototype.selectMany = function selectMany<T, T2>(select: (t: T) => T2[]): T2[] {
	const array = this as T[];
	return array.reduce((all, current) => { all.push(...select(current)); return all; }, [] as T2[]);
}

Array.prototype.swap = function swap<T>(indexA: number, indexB: number): Array<T> {
	const array = this as T[];

	const valueA = array[indexA];
	const valueB = array[indexB];

	array[indexA] = valueB;
	array[indexB] = valueA;

	return array;
}

Array.prototype.groupBy = function groupBy<TKey extends string|number|symbol, T>(keyFunc: (arrayValue: T) => TKey): Record<TKey, T[]> {
	const array = this as T[];
	return array.reduce((grouped, current) => {
		const key = keyFunc(current);
		grouped[key] = grouped[key] ?? [];
		grouped[key].push(current);
		return grouped;
	}, {} as Record<TKey, T[]>);
}

Array.prototype.toggleItem = function toggleItem<T>(item: T): T[] {
	const array = this as T[];
	const index = array.indexOf(item);

	if (index > -1) {
		array.splice(index, 1);
		return array;
	} else {
		return array.concat([item]);
	}
}

Array.prototype.toRecord = function toRecord<T, TKey extends string|number|symbol = string>(getKey: (value: T) => TKey): Record<TKey, T> {
	const array = this as T[];
	return array.reduce((all, current) => { all[getKey(current)] = current; return all; }, {} as Record<TKey, T>);
}

Array.prototype.first = function first<T>(matchFunc?: (t: T) => boolean): T {
	const array = this as T[];
	return Nullable.Value(matchFunc, array, (match) => array.filter(match))[0];
}

Array.prototype.single = function single<T>(matchFunc?: (t: T) => boolean): T {
	const array = this as T[];
	const result = Nullable.Value(matchFunc, array, (match) => array.filter(match));

	if (result.length !== 1) {
		throw new Error(`Tried to search array expecting exactly one item and found ${result.length} items`)
	}

	return result[0];
}

Array.prototype.min = function min<T>(valueSelector: (t: T) => string|number|null|undefined): T|null {
	const array = this as T[];

	if (array.length === 0) {
		return null;
	}

	return array.reduce((lowest, current) => {
		return lowest === null || (valueSelector(current) ?? "") < (valueSelector(lowest) ?? "") ? current : lowest;
	}, null as T|null);
}

Array.prototype.max = function max<T>(valueSelector: (t: T) => string|number|null|undefined): T|null {
	const array = this as T[];

	if (array.length === 0) {
		return null;
	}

	return array.reduce((largest, current) => {
		return largest === null || (valueSelector(current) ?? "") > (valueSelector(largest) ?? "") ? current : largest;
	}, null as T|null);
}

Array.prototype.coalesce = function coalesce<TIn, TOut>(lastResort: TOut, hasValueFunc?: (value: TIn) => boolean): TOut {
	const array = this as TIn[];
	return (array.find((v) => (hasValueFunc ?? Nullable.HasValue)(v)) as TOut|undefined|null) ?? lastResort;
}

Array.prototype.addCount = function addCount<T>(count: number, getItem?: (index: number) => T): T[] {
	const array = this as T[];
	const itemFunc = getItem ?? ((i) => i as T);

	array.push(...[...Array(count).keys()].map((v, index) => itemFunc(index)));
	return array;
}
