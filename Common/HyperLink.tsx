import * as React from "react";
import { Link } from "react-router-dom";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslationRequest, useTranslatedText } from "Common/TranslatedText";

interface HyperLinkProps extends StyleLayoutPropsWithRequiredDirection {
	to: string;
	classes?: string[];

	icon?: React.ReactNode;
	label?: string|TranslationRequest;
	children?: React.ReactNode;

	hiddenLabel?: boolean;

	onClick?: () => void;
	onDragStart?: (evt: React.DragEvent<HTMLElement>) => void;
}

export const HyperLink: React.FC<HyperLinkProps> = ({ to, classes, children, onClick, onDragStart, label, hiddenLabel, icon, ...props}) => {
	const background = useBackgroundStyles();
	const translatedLabel = useTranslatedText(label);

	return (
		<Link
			to={to}
			className={(classes ?? [background.transparent]).join(" ")}
			style={ApplyLayoutStyleProps(props)}
			onClick={() => { Nullable.TryExecute(onClick, (handler) => handler()); }}
			onDragStart={onDragStart}
			aria-label={translatedLabel}
		>
			{Nullable.HasValue(icon) && icon}
			{Nullable.HasValue(translatedLabel) && hiddenLabel !== true && translatedLabel}
			{Nullable.Value(children, <></>, child => <>{React.Children.map(child, (c) => c)}</>)}
		</Link>
	);
};
