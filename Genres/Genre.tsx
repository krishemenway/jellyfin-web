import * as React from "react";
import { useParams } from "react-router-dom";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import GenreIcon from "Genres/GenreIcon";

const Genre: React.FC = () => {
	const routeParams = useParams<{ genre: string }>();

	return (
		<PageWithNavigation icon={<GenreIcon size={24} />}>
			Genre {routeParams.genre}
		</PageWithNavigation>
	)
};

export default Genre;
