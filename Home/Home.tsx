import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { HomeIcon } from "Home/HomeIcon";
import { PageTitle } from "Common/PageTitle";

export const Home: React.FC = () => {
	return (
		<PageWithNavigation icon={<HomeIcon />}>
			<PageTitle text={({ Key: "Home" })} />
			This is where home stuff will go. Eventually. Good god.
		</PageWithNavigation>
	);
};
