export type FilterOperationFunc = (value: string[]|number[]|string|number|boolean|undefined|null, filterValue: string|number) => boolean;

export interface FilterOperation {
	Name: string;
	Operation: FilterOperationFunc;
	SupportsTypes: string[];
}
