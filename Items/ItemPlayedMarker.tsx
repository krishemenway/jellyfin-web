import * as React from "react";
import { Layout } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { CheckIcon } from "CommonIcons/CheckIcon";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ProgressCircle } from "Common/ProgressBar";

export const ItemPlayedMarker: React.FC<{ item: BaseItemDto }> = ( { item }) => {
	if (item.UserData?.Played !== true) {
		const percent = item.UserData?.PlayedPercentage;

		if (!Nullable.HasValue(percent) || percent === 0) {
			return <></>;
		} else {
			return (
				<Layout
					direction="row" position="absolute"
					top="-1px" right="-1px" backgroundImage="linear-gradient(to top right,transparent,transparent 50%,rgba(0,0,0,.90) 0,rgba(0,0,0,.90))"
					width="4rem" height="4rem"
					alignItems="start" justifyContent="end"
				>
					<ProgressCircle size="1.5rem" percentage={percent} />
				</Layout>
			)
		}
	}

	return (
		<Layout
			direction="row" position="absolute"
			top="-1px" right="-1px" backgroundImage="linear-gradient(to top right,transparent,transparent 50%,rgba(0,0,0,.90) 0,rgba(0,0,0,.90))"
			width="4rem" height="4rem"
			alignItems="start" justifyContent="end"
		>
			<CheckIcon size="1.5rem" mx=".25rem" my=".25rem" color="#F8F8F8" />
		</Layout>
	);
};

export const PlayedMarker: React.FC = () => {
	return (
		<Layout
			direction="row" position="absolute"
			top="-1px" right="-1px" backgroundImage="linear-gradient(to top right,transparent,transparent 50%,rgba(0,0,0,.90) 0,rgba(0,0,0,.90))"
			width="4rem" height="4rem"
			alignItems="start" justifyContent="end"
		>
			<CheckIcon size="1.5rem" mx=".25rem" my=".25rem" color="#F8F8F8" />
		</Layout>
	);
};
