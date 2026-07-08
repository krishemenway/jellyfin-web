import * as React from "react";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { InputField } from "Common/TextField";
import { EditableField } from "Common/EditableField";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { TranslationService } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface DateFieldProps extends StyleLayoutProps {
	field: EditableField<string|undefined|null> | EditableField<string> | EditableField<string|undefined>;
	disabled?: boolean;
	classes?: string[];
}

export const DateField: React.FC<DateFieldProps> = ({ field, disabled, ...props }) => {
	const [datePartRefsByIndex, setDatePartsRefs] = React.useState<Record<number, HTMLInputElement|null>>({});
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const dateParts = Intl.DateTimeFormat(culture).formatToParts(new Date());
	const currentDateParts = useObservable(field.Current)?.split("-") ?? [];
	const hasError = useComputed(() => !field.CanMakeRequest());
	const addRefFunc = (ref: HTMLInputElement|null, index: number) => {
		datePartRefsByIndex[index] = ref;
		setDatePartsRefs(datePartRefsByIndex);
	};

	const onKeyDown = React.useCallback((index: number, key: string) => {
		const nextParts = dateParts.slice(index + 1);
		const nextLiteral = nextParts.first((p) => p.type === "literal");

		if (Nullable.HasValue(nextLiteral) && key === nextLiteral.value) {
			const nextPart = nextParts.first((p) => p.type !== "literal");
			const nextPartIndex = dateParts.indexOf(nextPart);
			const element = datePartRefsByIndex[nextPartIndex];

			if (Nullable.HasValue(element)) {
				element.focus();
				return false;
			}
		}

		return true;
	}, [dateParts, datePartRefsByIndex])

	return (
		<Layout direction="row" justifyContent="center" alignItems="center" backgroundColor={hasError ? "Error" : "Field"} {...props}>
			{dateParts.map((part, index) => {
				switch (part.type) {
					case "day":
						return <Input key={field.FieldId+"-"+part.type} id={field.FieldId+"-"+part.type} currentValue={currentDateParts[2] ?? ""} part={part.type} width="2em" disabled={disabled} setRefFunc={(r) => addRefFunc(r, index)} onChange={(newValue) => field.OnChange(`${currentDateParts[0] ?? ""}-${currentDateParts[1] ?? ""}-${newValue}`)} classes={["edit-date-day"]} minLength={2} onKeyDown={(k) => onKeyDown(index, k)} />;
					case "month":
						return <Input key={field.FieldId+"-"+part.type} id={field.FieldId+"-"+part.type} currentValue={currentDateParts[1] ?? ""} part={part.type} width="2em" disabled={disabled} setRefFunc={(r) => addRefFunc(r, index)} onChange={(newValue) => field.OnChange(`${currentDateParts[0] ?? ""}-${newValue}-${currentDateParts[2] ?? ""}`)} classes={["edit-date-month"]} minLength={2} onKeyDown={(k) => onKeyDown(index, k)} />;
					case "year":
						return <Input key={field.FieldId+"-"+part.type} id={field.FieldId+"-"+part.type} currentValue={currentDateParts[0] ?? ""} part={part.type} width="3em" disabled={disabled} setRefFunc={(r) => addRefFunc(r, index)} onChange={(newValue) => field.OnChange(`${newValue}-${currentDateParts[1] ?? ""}-${currentDateParts[2] ?? ""}`)} classes={["edit-date-year"]} minLength={4} onKeyDown={(k) => onKeyDown(index, k)} />;
					case "literal":
						return <Layout key={field.FieldId+"-"+index} direction="row" elementType="span" children={part.value} classes={["edit-date-literal"]} />;
				}
			})}
		</Layout>
	);
};

const Input: React.FC<{ id: string; part: "literal"|"day"|"month"|"year"; currentValue: string; onChange: (newValue: string) => void; disabled?: boolean; classes: string[]; width: string; minLength: number; setRefFunc: (r: HTMLInputElement|null) => void; onKeyDown: (key: string, currentValue: string) => boolean }> = ({ id, part, currentValue, onChange, disabled, classes, width, minLength, setRefFunc, onKeyDown }) => {
	const optionallyPrependZeroes = React.useCallback(() => {
		if (currentValue.length < minLength && currentValue.length > 0) {
			onChange(new Array<string>().addCount(minLength - currentValue.length, () => "0").join("") + currentValue);
		}
	}, [currentValue, minLength, onChange]);

	return (
		<InputField
			type="number"
			id={id} classes={classes}
			disabled={disabled}
			value={currentValue}
			placeholder={{ Key: `LabelDate${part}` }}
			onChange={(v) => onChange(v ?? "")}
			onKeyDown={onKeyDown}
			ref={(r) => setRefFunc(r)}
			onBlur={optionallyPrependZeroes}
			px=".25em" py=".25em" width={width} textAlign="center"
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
