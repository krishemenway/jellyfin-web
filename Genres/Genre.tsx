import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { GenreIcon } from "Genres/GenreIcon";

export const Genre: React.FC = () => {
	const routeParams = useParams<{ genre: string }>();
	// This should include content from all libraries available on server to user.

	return (
		<PageWithNavigation icon={<GenreIcon size={24} />}>
			Genre {routeParams.genre}
		</PageWithNavigation>
	)
};
