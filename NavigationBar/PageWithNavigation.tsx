import * as React from "react";
import Layout from "Common/Layout";
import NavigationBar from "NavigationBar/NavigationBar";

const PageWithNavigation: React.FC<{ icon?: React.ReactElement; children?: React.ReactNode }> = (props) => {
	return (
		<Layout direction="column" px="3%" py={24}>
			<NavigationBar icon={props.icon} />
			<Layout direction="column" children={props.children} />
		</Layout>
	);
};

export default PageWithNavigation;
