import * as React from "react";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";

const Icon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" height={p.size} width={p.size} fill={p.color ?? "#9963C5"} className={p.className} viewBox="0 0 512 512"><path id="inner-shape" d="M256,201.62c-20.44,0-86.23,119.29-76.2,139.43s142.48,19.92,152.4,0S276.47,201.63,256,201.62Z"/><path id="outer-shape" d="M256,23.3C194.44,23.3-3.82,382.73,26.41,443.43s429.34,60,459.24,0S317.62,23.3,256,23.3ZM406.51,390.76c-19.59,39.33-281.08,39.77-300.89,0S215.71,115.48,256.06,115.48,426.1,351.42,406.51,390.76Z" /></svg>;
export default Icon;
