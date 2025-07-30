import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";

export const Genre: React.FC = () => {
	const routeParams = useParams<{ genre: string }>();
	// This should include content from all libraries available on server to user.

	return (
		<PageWithNavigation icon="Genre">
			Genre {routeParams.genre}
		</PageWithNavigation>
	)
};
