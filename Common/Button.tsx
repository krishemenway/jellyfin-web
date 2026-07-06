import * as React from "react";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";

interface BaseButtonProps extends StyleLayoutProps {
	icon?: React.ReactNode;

	label?: string|TranslationRequest;
	hiddenLabel?: boolean;

	children?: React.ReactNode,

	id?: string;
	classes?: string[];
	title?: TranslationRequest;

	disabled?: boolean;
	selected?: boolean;
	transparent?: boolean;

	onDragStart?: (evt: React.DragEvent<HTMLElement>) => void;
}

export interface ButtonProps extends BaseButtonProps {
	type: "button";
	onClick: (element: HTMLButtonElement, clickEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface SubmitButtonProps extends BaseButtonProps {
	type: "submit";
}

export interface ResetButtonProps extends BaseButtonProps {
	type: "reset";
}

const ForwardedButton: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps|SubmitButtonProps|ResetButtonProps> = (props, ref) => {
	const background = useBackgroundStyles();
	const translatedLabel = useTranslatedText(props.label);
	const translatedTitle = useTranslatedText(props.title);

	return (
		<button
			onClick={(evt) => props.type === "button" ? props.onClick(evt.currentTarget, evt) : undefined}
			style={ApplyLayoutStyleProps(props)}
			className={(props.classes ?? [(props.selected === true ? background.selected : props.transparent === true ? background.transparent : background.button)]).join(" ")}
			ref={ref}
			id={props.id}
			type={props.type}
			disabled={props.disabled}
			title={translatedTitle}
			aria-label={translatedLabel}
			onDragStart={(evt) => Nullable.TryExecute(props.onDragStart, (ods) => ods(evt))}>
			{Nullable.HasValue(props.icon) && props.icon}
			{Nullable.HasValue(translatedLabel) && props.hiddenLabel !== true && translatedLabel}
			{Nullable.HasValue(props.children) && <>{React.Children.map(props.children, (c) => c)}</>}
		</button>
	);
};

export const Button = React.forwardRef(ForwardedButton);
