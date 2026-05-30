import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import * as React from "react";

export const Duration: React.FC<{ ticks: number|undefined|null }> = (props) => {
	const totalProgress = React.useMemo(() => Nullable.Value(props.ticks, "00:00", (t) => DateTime.ConvertTicksToDurationString(t)), [props.ticks])
	return <>{totalProgress}</>;
};
