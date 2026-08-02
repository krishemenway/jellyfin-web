import * as React from "react";
import { Layout } from "Common/Layout";
import { Property } from "csstype";

export const ProgressBar: React.FC<{ height?: Property.Height, percentage: number }> = (props) => {
	return (
		<Layout direction="row" width="100%">
			<svg width={`${props.percentage}%`} height={props.height}><rect width="100%" height="100%" /></svg>
		</Layout>
	);
};

export const ProgressCircle: React.FC<{ size: string; percentage: number }> = ({ size, percentage }) => {
	const dashArray = 2 * Math.PI * progressCircleRadius;
	const offset = dashArray * ((100 - percentage)/100);

	return (
		<svg viewBox={`0 0 ${progressCircleWindowSize} ${progressCircleWindowSize}`} height={size} width={size} style={{ transform: "rotate(-90deg)"}}>
			<circle
				stroke="currentColor"
				strokeDashoffset={offset}
				strokeDasharray={dashArray}
				cx={progressCircleWindowSize / 2} cy={progressCircleWindowSize / 2} r={progressCircleRadius} fill="transparent" strokeWidth="12"
			/>
		</svg>
	);
};

const progressCircleRadius = 70;
const progressCircleWindowSize = 160;
