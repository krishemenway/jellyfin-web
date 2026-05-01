import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { GenreIcon } from "Genres/GenreIcon";

export const GenreService: BaseItemKindService = {
	kind: "Genre",
	findIcon: (props) => <GenreIcon {...props} />,
};
