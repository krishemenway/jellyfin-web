import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PhotoIcon } from "Photos/PhotoIcon";

export const PhotoService: BaseItemKindService = {
	findIcon: (props) => <PhotoIcon {...props} />,
};
