import * as React from "react";
import { Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { InputField } from "Common/TextField";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";
import { TranslationService } from "Common/TranslatedText";
import { SortByNumber } from "./ArrayPrototype";
import { Nullable } from "./MissingJavascriptFunctions";

interface DateFieldProps extends LayoutWithoutChildrenProps {
	field: EditableField<string|undefined|null> | EditableField<string> | EditableField<string|undefined>;
	disabled?: boolean;
	classes?: string[];
}

interface DatePart {
	Type: "Part";
	Index: number;
	Value: string;
	Part: string;
	GetValue: (dateParts: string[]) => string;
	OnChange: (newValue: string, dateParts: string[]) => string;
}

interface DateSymbol {
	Type: "Symbol";
	Symbol: string;
	Index: number;
}

export const DateField: React.FC<DateFieldProps> = ({ field, disabled, ...props }) => {
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const formatDate = Intl.DateTimeFormat(culture).format(new Date(2000, 9, 11));
	const currentDateParts = useObservable(field.Current)?.split("-") ?? [];

	const dateParts = React.useMemo(() => [
		{ Type: "Part", Part: "Year", Value: "2000", OnChange: (newValue: string, dateParts: string[]) => `${newValue ?? ""}-${dateParts[1] ?? ""}-${dateParts[2] ?? ""}`, GetValue: (dateParts: string[]) => dateParts[0] ?? "", Index: formatDate.indexOf("2000") } as DatePart,
		{ Type: "Part", Part: "Month", Value: "10", OnChange: (newValue: string, dateParts: string[]) => `${dateParts[0] ?? ""}-${newValue ?? ""}-${dateParts[2] ?? ""}`, GetValue: (dateParts: string[]) => dateParts[1] ?? "", Index: formatDate.indexOf("10") } as DatePart,
		{ Type: "Part", Part: "Day", Value: "11", OnChange: (newValue: string, dateParts: string[]) => `${dateParts[0] ?? ""}-${dateParts[1] ?? ""}-${newValue ?? ""}`, GetValue: (dateParts: string[]) => dateParts[2] ?? "", Index: formatDate.indexOf("11") } as DatePart,
	].sort(SortByNumber(n => n.Index)), [formatDate]);

	const dateSymbols = dateParts.map((part, index, all) => {
		const potentialSymbolIndex = part.Index + part.Value.length;
		const nextItem = all[index + 1];

		if (Nullable.HasValue(nextItem)) {
			const content = formatDate.substring(potentialSymbolIndex, nextItem.Index);

			if (Nullable.StringHasValue(content)) {
				return {
					Type: "Symbol",
					Symbol: formatDate.substring(potentialSymbolIndex, nextItem.Index),
					Index: potentialSymbolIndex,
				} as DateSymbol;
			}
		}

		return undefined;
	}).filter(Nullable.HasValue);

	const order = React.useMemo(() => ([] as (DatePart|DateSymbol)[]).concat(dateParts).concat(dateSymbols).sort(SortByNumber(n => n.Index)), [dateParts, dateSymbols]);

	return (
		<Layout direction="row" justifyContent="center" alignItems="center" {...props}>
			{order.map((o) => {
				return o.Type === "Part"
					? <InputField type="number" disabled={disabled} key={`${field.FieldId}-${o.Part}`} id={`${field.FieldId}-${o.Part}`} value={o.GetValue(currentDateParts)} onChange={(value) => field.OnChange(o.OnChange(value, currentDateParts))} placeholder={{ Key: `LabelDate${o.Part}` }} px=".25em" py=".25em" width={o.Value.length + "em"} textAlign="center" />
					: <Layout key={`${field.FieldId}-${o.Index}`} direction="row" elementType="span">{o.Symbol}</Layout>
			})}
		</Layout>
	);
};

const ForwardedDateField: React.ForwardRefRenderFunction<HTMLInputElement, DateFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <InputField {...props} id={props.field.FieldId} type="date" value={currentValue ?? ""} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

const ForwardedTimeField: React.ForwardRefRenderFunction<HTMLInputElement, DateFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return <InputField {...props} id={props.field.FieldId} type="time" value={currentValue ?? ""} onChange={(newValue) => props.field.OnChange(newValue)} ref={ref} />;
};

export const NativeDateField = React.forwardRef(ForwardedDateField);
export const NativeTimeField = React.forwardRef(ForwardedTimeField);
