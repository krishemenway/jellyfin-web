import * as React from "react";
import { TranslatedText, TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "./MissingJavascriptFunctions";

interface BaseButtonProps extends StyleLayoutProps {
	icon?: React.ReactNode;

	label?: string|TranslationRequest;

	children?: React.ReactNode,

	className?: string;
	title?: string;

	disabled?: boolean;
	selected?: boolean;
	transparent?: boolean;
}

export interface ButtonProps extends BaseButtonProps {
	type: "button";
	onClick: (element: HTMLButtonElement) => void;
}

export interface SubmitButtonProps extends BaseButtonProps {
	type: "submit";
}

export interface ResetButtonProps extends BaseButtonProps {
	type: "reset";
}

const ForwardedButton: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps|SubmitButtonProps|ResetButtonProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const title = useTranslatedText(props.title);

	return (
		<button
			onClick={(evt) => props.type === "button" ? props.onClick(evt.currentTarget) : undefined}
			style={ApplyLayoutStyleProps(props)}
			className={props.className ?? (props.selected === true ? background.selected : props.transparent === true ? background.transparent : background.button)}
			ref={ref}
			type={props.type}
			disabled={props.disabled}
			title={title}>
			{Nullable.HasValue(props.icon) && props.icon}
			{Nullable.HasValue(props.label) && (typeof props.label === "string" ? <TranslatedText textKey={props.label} /> : <TranslatedText textKey={props.label.Key} textProps={props.label.KeyProps} />)}
			{Nullable.HasValue(props.children) && <>{React.Children.map(props.children, (c) => c)}</>}
		</button>
	);
};

export const Button = React.forwardRef(ForwardedButton);
