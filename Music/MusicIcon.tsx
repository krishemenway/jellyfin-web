import * as React from "react";
import { ApplyIconPropsToSvg, IconProps } from "Common/IconProps";

export const MusicIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 -960 960 960"><path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z"/></svg>;
