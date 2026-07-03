import * as React from "react";
import { ApplyLayoutStyleProps, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "./MissingJavascriptFunctions";

interface ImageProps extends StyleLayoutProps {
	url: string;
	altText: string;
	fallbackUrls?: string[];
	lazy?: boolean;
	classes?: string[];
}

export function Image({ classes, url, altText, lazy, fallbackUrls, ...props }: ImageProps): React.ReactNode {
	const onImageLoadError = React.useCallback((evt: React.SyntheticEvent<HTMLImageElement, Event>) => Nullable.TryExecute(fallbackUrls, (urls) => {
		const currentUrl = evt.currentTarget.src;

		Nullable.TryExecute(urls[urls.indexOf(currentUrl) + 1], nextUrl => {
			if (evt.currentTarget.src !== nextUrl) {
				evt.currentTarget.src = nextUrl;
			}
		});
	}), [fallbackUrls]);

	return (
		<img
			className={classes?.join(" ")}
			src={url}
			alt={altText}
			style={ApplyLayoutStyleProps(props)}
			loading={lazy === true ? "lazy" : "eager"}
			onError={onImageLoadError}
		/>
	);
}
