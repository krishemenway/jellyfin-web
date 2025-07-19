import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";

export const Tag: React.FC = () => {
	const routeParams = useParams<{ tag: string }>();

	return (
		<PageWithNavigation icon={<TagIcon size={24} />}>
			Tag {routeParams.tag}
		</PageWithNavigation>
	);
};
