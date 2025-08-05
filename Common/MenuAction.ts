import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { IconProps } from "Common/IconProps";

export interface MenuAction {
	icon: (props: IconProps) => JSX.Element,
	textKey: string;
	action: () => void;
	visible?: (policy: UserDto) => boolean;
}
