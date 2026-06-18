import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { NavigateFunction } from "react-router-dom";

export interface ItemMenuAction {
	icon: (props: IconProps) => React.ReactNode,
	textKey: string;
	action: (items: readonly BaseItemDto[], navigate: NavigateFunction, reloadItems: () => void) => void;
	visible?: (policy: UserDto, items: readonly BaseItemDto[]) => boolean;
	modal?: (items: readonly BaseItemDto[]) => React.ReactNode,
}
