import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import GenreIcon from "Genres/GenreIcon";

const Tag: React.FC = () => {
	return (
		<PageWithNavigation icon={<GenreIcon size={24} />}>
			All Genres
		</PageWithNavigation>
	)
};

export default Tag;