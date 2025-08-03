import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { PageTitle } from "Common/PageTitle";

export const Studios: React.FC = () => {
	return (
		<PageWithNavigation icon="Studio">
			<PageTitle text={({ Key: "Studios" })} />
			All Studios
		</PageWithNavigation>
	);
};
