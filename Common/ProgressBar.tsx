import * as React from "react";
import { Layout } from "Common/Layout";
import { useObservable } from "@residualeffect/rereactor";
import { ThemeService } from "Themes/ThemeService";
import { Property } from "csstype";

export const ProgressBar: React.FC<{ height?: Property.Height, percentage: number }> = (props) => {
	const theme = useObservable(ThemeService.Instance.CurrentTheme);

	return (
		<Layout direction="row" width="100%">
			<Layout direction="row" width={`${props.percentage}%`} height={props.height} backgroundColor={theme.PrimaryTextColor} />
		</Layout>
	);
};
