import * as React from "react";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";

export const BackwardIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 -960 960 960"><path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>;
