import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { GenreIcon } from "Genres/GenreIcon";

export const GenreService: BaseItemKindService = {
	findIcon: (props) => <GenreIcon {...props} />,
};
