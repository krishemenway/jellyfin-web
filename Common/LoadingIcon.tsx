import * as React from "react";
import { createStyles } from "Common/AppStyles";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";

const useLoadingStyles = createStyles({
	'@keyframes circleAnimation': {
		"0%": { strokeDasharray: "1px,200px", strokeDashoffset: "0" },
		"50%": { strokeDasharray: "100px,200px", strokeDashoffset: "-15px" },
		"100%": { strokeDasharray: "100px,200px", strokeDashoffset: "-125px" },
	},
	circle: {
		stroke: "currentcolor",
		strokeDasharray: "80px, 200px",
		strokeDashoffset: "0px",
		animation: "1.4s ease-in-out 0s infinite normal none running $circleAnimation",
	},
});

export const LoadingIcon: React.FC<IconProps> = (props) => {
	const [loading] = [useLoadingStyles()];
	return <svg {...ApplyIconPropsToSvg(props)} viewBox="22 22 44 44"><circle className={loading.circle} cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle></svg>;
};
