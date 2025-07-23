import * as React from "react";
import { BaseItemKindService } from "Items/BaseItemKindService";
import { PeopleIcon } from "People/PeopleIcon";

export const PersonService: BaseItemKindService = {
	findIcon: (props) => <PeopleIcon {...props} />,
};
