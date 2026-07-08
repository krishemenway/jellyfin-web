import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { EditableField } from "Common/EditableField";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface TextFieldProps extends BaseInputFieldProps {
	field: EditableField<string|undefined|null> | EditableField<string> | EditableField<string|undefined>;
	password?: boolean;
	multiLine?: boolean;
	autoComplete?: boolean;
}

interface NumberFieldProps extends BaseInputFieldProps {
	field: EditableField<number|undefined|null> | EditableField<number|undefined>;
	autoComplete?: boolean;
}

interface InputFieldProps extends BaseInputFieldProps {
	id: string;
	value: string;
	onChange: (newValue: string) => void;
	onKeyDown?: (key: string, currentValue: string) => boolean;
	autoComplete?: AutoFill;
}

interface BaseInputFieldProps extends LayoutWithoutChildrenProps {
	classes?: string[];
	type?: React.HTMLInputTypeAttribute;

	disabled?: boolean;

	placeholder?: TranslationRequest;

	onBlur?: () => void;
}

const ForwardedNumberField: React.ForwardRefRenderFunction<HTMLInputElement, NumberFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return (
		<InputField
			{...props}
			type="number"
			ref={ref} id={props.field.FieldId}
			autoComplete={props.autoComplete === true ? "on" : "off"}
			value={currentValue?.toString() ?? ""}
			onChange={(newValue) => props.field.OnChange(Nullable.StringValue(newValue, undefined, nv => parseFloat(nv)))}
		/>
	);
};

const ForwardedTextField: React.ForwardRefRenderFunction<HTMLInputElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return (
		<InputField
			{...props}
			id={props.field.FieldId} ref={ref}
			type={props.password ? "password" : "text"}
			value={currentValue ?? ""}
			onChange={(newValue) => props.field.OnChange(newValue)}
			autoComplete={props.password === true ? (props.autoComplete === true ? "on" : "new-password") : "off"}
		/>
	);
};

const ForwardedMultiLineField: React.ForwardRefRenderFunction<HTMLTextAreaElement, TextFieldProps> = (props, ref) => {
	const currentValue = useObservable(props.field.Current);
	return (
		<TextAreaField
			{...props}
			id={props.field.FieldId} ref={ref}
			value={currentValue ?? ""}
			onChange={(newValue) => props.field.OnChange(newValue)}
			autoComplete={props.autoComplete === true ? "on" : "off"}
		/>
	);
};

const ForwardedInputField: React.ForwardRefRenderFunction<HTMLInputElement, InputFieldProps> = (props, ref) => {
	const placeholder = Nullable.Value(props.placeholder, undefined, (p) => useTranslatedText(p));

	return (
		<input
			type={props.type}
			ref={ref}
			id={props.id}
			className={props.classes?.join(" ")}
			value={props.value}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { props.onChange(evt.currentTarget.value); }}
			onKeyDown={Nullable.Value(props.onKeyDown, undefined, kd => (evt: React.KeyboardEvent<HTMLInputElement>) => { if (!kd(evt.key, evt.currentTarget.value)) { evt.preventDefault(); } })}
			autoFocus={true}
			disabled={props.disabled}
			autoComplete={props.autoComplete}
			style={ApplyLayoutStyleProps(props)}
			placeholder={placeholder}
		/>
	);
};

const ForwardedTextAreaField: React.ForwardRefRenderFunction<HTMLTextAreaElement, InputFieldProps> = (props, ref) => {
	const placeholder = Nullable.Value(props.placeholder, undefined, (p) => useTranslatedText(p));

	return (
		<textarea
			ref={ref}
			id={props.id}
			className={props.classes?.join(" ")}
			value={props.value}
			onBlur={() => props.onBlur && props.onBlur()}
			onChange={(evt) => { evt.target.style.height = `${evt.target.scrollHeight}px`; props.onChange(evt.currentTarget.value); }}
			autoFocus={true}
			disabled={props.disabled}
			autoComplete={props.autoComplete}
			style={ApplyLayoutStyleProps(props)}
			placeholder={placeholder}
		/>
	);
};

export const NumberField = React.forwardRef(ForwardedNumberField);
export const InputField = React.forwardRef(ForwardedInputField);
export const TextAreaField = React.forwardRef(ForwardedTextAreaField);
export const TextField = React.forwardRef(ForwardedTextField);
export const MultiLineField = React.forwardRef(ForwardedMultiLineField);
