import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";

export const Studio: React.FC = () => {
	const routeParams = useParams<{ studioId: string }>();

	return (
		<PageWithNavigation icon="Studio">
			Studio {routeParams.studioId}
		</PageWithNavigation>
	)
};
