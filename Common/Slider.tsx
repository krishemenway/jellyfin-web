import * as React from "react";
import { ApplyLayoutStyleProps, LayoutWithoutChildrenProps } from "Common/Layout";

export const Slider: React.FC<{ min: number; max: number; current: number; step?: number; onChange: (newValue: number) => void }&LayoutWithoutChildrenProps> = (props) => {
	return <input type="range" min={props.min} max={props.max} step={props.step} value={props.current} style={ApplyLayoutStyleProps(props)} onChange={(evt) => { props.onChange(parseInt(evt.target.value, 10)); }} />;
};
