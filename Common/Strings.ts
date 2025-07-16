export function Coalesce(strings: string[], defaultValue?: string) {
	return strings.find(HasValue) ?? defaultValue ?? "";
}

export function HasValue(value: string|undefined|null) {
	return value !== null && value !== undefined && value.length > 0;
}
