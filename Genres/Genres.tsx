import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { GenreIcon } from "Genres/GenreIcon";

export const Genres: React.FC = () => {
	// This should include all the genres available on all servers to the user.

	return (
		<PageWithNavigation icon={<GenreIcon size={24} />}>
			All Genres
		</PageWithNavigation>
	)
};
