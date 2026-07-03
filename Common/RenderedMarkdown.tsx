import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";

interface RenderedMarkdownProps extends StyleLayoutProps {
	classes?: string[];
	content: string;
}

const ForwardedRenderedMarkdown: React.ForwardRefRenderFunction<HTMLDivElement, RenderedMarkdownProps> = ({ classes, content, ...props }, ref) => (
	<div className={classes?.join(" ")} style={ApplyLayoutStyleProps(props)} ref={ref} dangerouslySetInnerHTML={{ __html: content }} />
);

export const RenderedMarkdown = React.forwardRef(ForwardedRenderedMarkdown);
