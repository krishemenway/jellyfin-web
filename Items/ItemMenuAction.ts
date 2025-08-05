import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";

export interface ItemMenuAction {
	icon: (props: IconProps) => React.ReactNode,
	textKey: string;
	action: (items: BaseItemDto[]) => void;
	visible?: (policy: UserDto) => boolean;
	modal?: (items: BaseItemDto[]) => React.ReactNode,
}
