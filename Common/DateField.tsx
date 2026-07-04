import * as React from "react";
import { Layout, LayoutWithoutChildrenProps } from "Common/Layout";
import { InputField } from "Common/TextField";
import { EditableField } from "Common/EditableField";
import { useObservable } from "@residualeffect/rereactor";
import { TranslationService } from "Common/TranslatedText";

interface DateFieldProps extends LayoutWithoutChildrenProps {
	field: EditableField<string|undefined|null> | EditableField<string> | EditableField<string|undefined>;
	disabled?: boolean;
	classes?: string[];
}

export const DateField: React.FC<DateFieldProps> = ({ field, disabled, ...props }) => {
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const dateParts = Intl.DateTimeFormat(culture).formatToParts(new Date());
	const currentDateParts = useObservable(field.Current)?.split("-") ?? [];

	return (
		<Layout direction="row" justifyContent="center" alignItems="center" {...props}>
			{dateParts.map((part, index) => {
				switch (part.type) {
					case "day":
						return <Input key={field.FieldId} currentValue={currentDateParts[2] ?? ""} part="day" disabled={disabled} onChange={(newValue) => field.OnChange(`${dateParts[0] ?? ""}-${dateParts[1] ?? ""}-${newValue ?? ""}`)} classes={["edit-date-day"]} />;
					case "month":
						return <Input key={field.FieldId} currentValue={currentDateParts[1] ?? ""} part="month" disabled={disabled} onChange={(newValue) => field.OnChange(`${dateParts[0] ?? ""}-${newValue ?? ""}-${dateParts[2] ?? ""}`)} classes={["edit-date-month"]} />;
					case "year":
						return <Input key={field.FieldId} currentValue={currentDateParts[0] ?? ""} part="year" disabled={disabled} onChange={(newValue) => field.OnChange(`${newValue ?? ""}-${dateParts[1] ?? ""}-${dateParts[2] ?? ""}`)} classes={["edit-date-year"]} />;
					case "literal":
						return <Layout key={field.FieldId + "-" + index} direction="row" elementType="span" children={part.value} classes={["edit-date-literal"]} />;
				}
			})}
		</Layout>
	);
};

const Input: React.FC<{ key: string; part: "literal"|"day"|"month"|"year"; currentValue: string; onChange: (newValue: string) => void; disabled?: boolean; classes: string[] }> = ({ key, part, currentValue, onChange, disabled, classes }) => {
	return (
		<InputField
			type="number"
			key={key} id={key}
			classes={classes}
			disabled={disabled}
			value={currentValue}
			placeholder={{ Key: `LabelDate${part}` }}
			onChange={(v) => onChange(v)}
			px=".25em" py=".25em" width={currentValue.length + "em"} textAlign="center"
		/>
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
