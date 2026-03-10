import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";

export const ItemRating: React.FC<{ item: BaseItemDto }&StyleLayoutProps> = (props) => {
	const background = useBackgroundStyles();
	const combined = {...{fontSize: "1.5em", px: ".25em", py: ".25em" } as StyleLayoutProps, ...props as StyleLayoutProps};
	const rating = Linq.Coalesce([props.item.CustomRating, props.item.OfficialRating], "", (r) => Nullable.StringHasValue(r));

	return rating && <Layout direction="row" {...combined} className={background.alternatePanel} >{rating}</Layout>;
};
