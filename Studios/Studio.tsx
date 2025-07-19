import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { StudioIcon } from "Studios/StudioIcon";

export const Studio: React.FC = () => {
	const routeParams = useParams<{ studioId: string }>();

	return (
		<PageWithNavigation icon={<StudioIcon size={24} />}>
			Studio {routeParams.studioId}
		</PageWithNavigation>
	)
};
