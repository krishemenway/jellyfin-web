import * as React from "react";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { InputField } from "Common/TextField";
import { EditableField } from "Common/EditableField";
import { useComputed, useObservable } from "@residualeffect/rereactor";
import { TranslationService } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface DateFieldProps extends StyleLayoutProps {
	field: EditableField<string|undefined|null> | EditableField<string> | EditableField<string|null> | EditableField<string|undefined>;
	disabled?: boolean;
	classes?: string[];
}

const maxLengthsByPart: Record<string, number> = { "year": 4, "month": 2, "day": 2, "hour": 2, "minute": 2, "second": 2 };
const dateToFormat = new Date();

function dateToParts(date: string): Record<string, string> {
	const [dayParts, timeOfDayParts] = date.split("T");
	const [year, month, day] = (dayParts ?? "").split("-");
	const [hour, minute, second] = (timeOfDayParts ?? "").split(":");
	return { "year": year, "month": month, "day": day, "hour": hour, "minute": minute, "second": second };
}

const Empty: Record<string, string> = { "year": "", "month": "", "day": "", "hour": "", "minute": "", "second": ""  }

const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: "numeric" };
export const DateField: React.FC<DateFieldProps> = ({ ...props }) => {
	const currentValue = Nullable.Value(useObservable(props.field.Current), Empty, (cv) => dateToParts(cv));
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const dateParts = React.useMemo(() => Intl.DateTimeFormat(culture, dateOptions).formatToParts(dateToFormat), [culture]);

	return <DateFieldForParts dateParts={dateParts} current={currentValue} {...props} />
}

const dateTimeOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", };
export const DateTimeField: React.FC<DateFieldProps> = ({ ...props }) => {
	const currentValue = Nullable.Value(useObservable(props.field.Current), Empty, (cv) => dateToParts(cv));
	const culture = useObservable(TranslationService.Instance.CurrentCulture);
	const dateParts = React.useMemo(() => Intl.DateTimeFormat(culture, dateTimeOptions).formatToParts(dateToFormat), [culture]);

	return <DateFieldForParts dateParts={dateParts} current={currentValue} {...props} />
}

const DateFieldForParts: React.FC<DateFieldProps&{ dateParts: Intl.DateTimeFormatPart[]; current: Record<string, string> }> = ({ field, disabled, dateParts, current, ...props }) => {
	const [datePartRefsByIndex, setDatePartsRefs] = React.useState<Record<number, HTMLInputElement|null>>({});
	const hasError = useComputed(() => !field.CanMakeRequest());
	const withTimeParts = React.useMemo(() => dateParts.filter(dp => dp.type === "hour").length === 1, [dateParts]);
	const addRefFunc = (ref: HTMLInputElement|null, index: number) => {
		datePartRefsByIndex[index] = ref;
		setDatePartsRefs(datePartRefsByIndex);
	};

	const gotoNextPart = React.useCallback((afterIndex: number) => {
		const nextParts = dateParts.slice(afterIndex + 1);
		const nextPart = nextParts.first((p) => p.type !== "literal");

		if (nextPart === undefined) {
			return false;
		}

		const nextPartIndex = dateParts.indexOf(nextPart);
		const element = datePartRefsByIndex[nextPartIndex];

		if (Nullable.HasValue(element)) {
			window.setTimeout(() => { element.focus(); }, 100);
			return true;
		}
	}, [dateParts, datePartRefsByIndex]);

	const gotoNextPartWhenReady = React.useCallback((newValue: string, part: string, index: number) => {
		if (newValue.length >= maxLengthsByPart[part]) {
			gotoNextPart(index);
		}
	}, [gotoNextPart]);

	const onKeyDown = React.useCallback((index: number, key: string) => {
		const nextParts = dateParts.slice(index + 1);
		const nextLiteral = nextParts.first((p) => p.type === "literal");

		if (Nullable.HasValue(nextLiteral) && key === nextLiteral.value) {
			gotoNextPart(index);
			return false;
		}

		return true;
	}, [dateParts]);

	return (
		<Layout direction="row" justifyContent="center" alignItems="center" backgroundColor={hasError ? "Error" : "Field"} {...props}>
			{dateParts.map((part, index) => {
				const id = `${field.FieldId}-${part.type}`;

				switch (part.type) {
					case "second":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="2em" minLength={2} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${current["year"]}-${current["month"]}-${current["day"]}T${current["hour"]}:${current["minute"]}:${newValue}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "minute":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="2em" minLength={2} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${current["year"]}-${current["month"]}-${current["day"]}T${current["hour"]}:${newValue}:${current["second"]}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "hour":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="2em" minLength={2} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${current["year"]}-${current["month"]}-${current["day"]}T${newValue}:${current["minute"]}:${current["second"]}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "day":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="2em" minLength={2} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${current["year"]}-${current["month"]}-${newValue}${withTimeParts ? `T${current["hour"]}:${current["minute"]}:${current["second"]}` : ""}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "month":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="2em" minLength={2} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${current["year"]}-${newValue}-${current["day"]}${withTimeParts ? `T${current["hour"]}:${current["minute"]}:${current["second"]}` : ""}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "year":
						return <Input key={id} id={id} part={part} disabled={disabled} currentValue={current} width="3em" minLength={4} setRefFunc={r => addRefFunc(r, index)} onChange={newValue => { gotoNextPartWhenReady(newValue, part.type, index); field.OnChange(`${newValue}-${current["month"]}-${current["day"]}${withTimeParts ? `T${current["hour"]}:${current["minute"]}:${current["second"]}` : ""}`); }} onKeyDown={k => onKeyDown(index, k)} />;
					case "literal":
						return <Layout key={field.FieldId+"-"+index} direction="row" elementType="span" children={part.value} classes={["edit-date-literal"]} />;
				}
			})}
		</Layout>
	);
};

const Input: React.FC<{ id: string; part: Intl.DateTimeFormatPart; currentValue: Record<string, string>; onChange: (newValue: string) => void; disabled?: boolean; width: string; minLength: number; setRefFunc: (r: HTMLInputElement|null) => void; onKeyDown: (key: string, currentValue: string) => boolean }> = ({ id, part, currentValue, onChange, disabled, width, minLength, setRefFunc, onKeyDown }) => {
	const current = currentValue[part.type];
	const optionallyPrependZeroes = React.useCallback(() => {
		if (current.length < minLength && current.length > 0) {
			onChange(new Array<string>().addCount(minLength - current.length, () => "0").join("") + current);
		}
	}, [current, minLength, onChange]);

	return (
		<InputField
			type="number"
			id={id}
			classes={[`edit-date-${part.type}`]}
			disabled={disabled}
			value={current}
			placeholder={{ Key: `LabelDate-${part.type}` }}
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
