import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { FavoriteIcon } from "CommonIcons/FavoriteIcon";
import { IconProps } from "Common/IconProps";

export const ItemFavoriteIcon: React.FC<{ item: BaseItemDto }&IconProps> = ({ item, ...props }) => {
	if (item.UserData?.IsFavorite !== true) {
		return <></>;
	}

	return <FavoriteIcon {...props} />;
};
