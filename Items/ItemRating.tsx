import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { useBackgroundStyles } from "Common/AppStyles";

export const ItemRating: React.FC<{ item: BaseItemDto }&StyleLayoutProps> = (props) => {
	const background = useBackgroundStyles();
	const combined = {...{fontSize: "1.5em", px: 4, py: 4 } as StyleLayoutProps, ...props as StyleLayoutProps};
	const rating = props.item.CustomRating ?? props.item.OfficialRating;

	return rating && <Layout direction="row" {...combined} className={background.alternatePanel} >{rating}</Layout>;
};
