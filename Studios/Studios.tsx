import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import TagIcon from "Tags/TagIcon";

const Studios: React.FC = () => {
	return (
		<PageWithNavigation icon={<TagIcon size={24} />}>
			All Studios
		</PageWithNavigation>
	)
};

export default Studios;
