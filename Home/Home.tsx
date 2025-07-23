import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { HomeIcon } from "Home/HomeIcon";

export const Home: React.FC = () => {
	return (
		<PageWithNavigation icon={<HomeIcon size={24} />}>
			This is where home stuff will go. Eventually. Good god.
		</PageWithNavigation>
	);
};
