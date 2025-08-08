export type FilterOperationFunc = (value: string[]|number[]|string|number|boolean|undefined|null, filterValue: string) => boolean;

export interface FilterOperation {
	Name: string;
	Operation: FilterOperationFunc;
	Display: (filterValue: string) => string[];
}
