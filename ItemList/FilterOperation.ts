export type FilterOperationFunc = (value: string[]|number[]|string|number|boolean|undefined|null, filterValue: string|string[]) => boolean;

export interface FilterOperation {
	Name: string;
	Operation: FilterOperationFunc;
	Display: (filterValue: string|string[]) => string[];
}
