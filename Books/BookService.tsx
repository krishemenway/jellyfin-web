import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { BookIcon } from "Books/BookIcon";

export const BookService: BaseItemKindService = {
	findIcon: (props) => <BookIcon {...props} />,
};
