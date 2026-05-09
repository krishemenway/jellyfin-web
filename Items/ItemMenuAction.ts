import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";
import { NavigateFunction } from "react-router-dom";

export interface ItemMenuAction {
	icon: (props: IconProps) => React.ReactNode,
	textKey: string;
	action: (items: BaseItemDto[], navigate: NavigateFunction) => void;
	visible?: (policy: UserDto) => boolean;
	modal?: (items: BaseItemDto[]) => React.ReactNode,
}
