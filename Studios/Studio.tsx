import * as React from "react";
import { useParams } from "react-router-dom";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import StudioIcon from "Studios/StudioIcon";

const Studio: React.FC = () => {
	const routeParams = useParams<{ studio: string }>();

	return (
		<PageWithNavigation icon={<StudioIcon size={24} />}>
			Studio {routeParams.studio}
		</PageWithNavigation>
	)
};

export default Studio;
