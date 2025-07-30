import * as React from "react";
import { TranslatedText, useTranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";

interface BaseButtonProps extends StyleLayoutProps {
	label?: string;
	labelProps?: string[];

	children?: React.ReactNode,

	className?: string;
	title?: string;

	disabled?: boolean;
	selected?: boolean;
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
			className={props.className ?? (props.selected === true ? background.selected : background.button)}
			ref={ref}
			type={props.type}
			disabled={props.disabled}
			title={title}>
			{props.label ? (
				<TranslatedText textKey={props.label} textProps={props.labelProps} />
			) : (
				<>{React.Children.map(props.children, (c) => c)}</>
			)}
		</button>
	);
};

export const Button = React.forwardRef(ForwardedButton);
