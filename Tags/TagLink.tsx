import * as React from "react";
import { HyperLink } from "Common/HyperLink";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";

export const TagLink: React.FC<{ tag: string; classes?: string[]; }&StyleLayoutPropsWithRequiredDirection> = (props) => (
	<HyperLink to={`/Tags/${props.tag}`} {...props} children={props.tag} />
);
