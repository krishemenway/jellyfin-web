import * as React from "react";
import { CollectionTypeService } from "Collections/CollectionTypeService";
import { RecordingIcon } from "Movies/RecordingIcon";

export const HomeVideosCollectionService: CollectionTypeService = {
	type: "homevideos",
	listUrl: (libraryId) => `/HomeVideos/${libraryId}`,
	findIcon: (props) => <RecordingIcon {...props} />,
	listTypes: ["PhotoAlbum", "Video", "Photo"],
};
