import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PhotoIcon } from "Photos/PhotoIcon";

export const PhotoService: BaseItemKindService = {
	kind: "Photo",
	findIcon: (props) => <PhotoIcon {...props} />,
	listUrl: (library) => `/Photos/${library.Id}`,
};
