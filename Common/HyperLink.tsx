import * as React from "react";
import { Link } from "react-router-dom";
import { ApplyLayoutStyleProps, StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export const HyperLink: React.FC<{ to: string, className?: string; children?: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	return <Link to={props.to} className={props.className} children={props.children} style={ApplyLayoutStyleProps(props)} />;
}
