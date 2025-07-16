import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import TagIcon from "Tags/TagIcon";

const Tags: React.FC = () => {
	return (
		<PageWithNavigation icon={<TagIcon size={24} />}>
			All Tags
		</PageWithNavigation>
	)
};

export default Tags;
