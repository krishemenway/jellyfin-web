import * as React from "react";
import { Link } from "react-router-dom";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";

export const HyperLink: React.FC<{ to: string, className?: string; children?: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	const background = useBackgroundStyles();
	return <Link to={props.to} className={props.className ?? background.transparent} children={props.children} style={ApplyLayoutStyleProps(props)} />;
}
