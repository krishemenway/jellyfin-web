import * as React from "react";
import { createStyles } from "Common/AppStyles";
import AnimatedLoadingIcon from "Common/LoadingIcon";
import Layout from "Common/Layout";

const LoadingSpinner: React.FC = () => {
	const loading = useLoadingStyles();

	return (
		<Layout direction="column">
			<Layout my={16} direction="row"><AnimatedLoadingIcon size="48px" /></Layout>
			<Layout my={16} direction="row" gap={8}>
				Loading

				<Layout direction="row" className={loading.ellipsesContainer}>
					<Layout direction="row">&hellip;</Layout>
				</Layout>
			</Layout>
		</Layout>
	);
};

export const useLoadingStyles = createStyles(() => ({
	'@keyframes ellipses': {
		"0%": { width: "4px", },
		"32%": { width: "4px", },
		"33%": { width: "8px", },
		"65%": { width: "8px", },
		"66%": { width: "12px", },
		"100%": { width: "12px", },
	},
	ellipsesContainer: {
		width: "1em",
		
		"& > *": {
			animation: "4s linear 0s infinite normal none running $ellipses",
			overflow: "hidden",
		}
	},
}));

export default LoadingSpinner;
