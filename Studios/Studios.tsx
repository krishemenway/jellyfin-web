import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { StudioIcon } from "Studios/StudioIcon";

export const Studios: React.FC = () => {
	return (
		<PageWithNavigation icon={<StudioIcon size={24} />}>
			All Studios
		</PageWithNavigation>
	);
};
