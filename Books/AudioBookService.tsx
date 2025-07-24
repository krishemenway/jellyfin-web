import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { AudioBookIcon } from "Books/AudioBookIcon";

export const AudioBookService: BaseItemKindService = {
	findIcon: (props) => <AudioBookIcon {...props} />,
};
