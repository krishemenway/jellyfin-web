import * as React from "react";
import { HyperLink } from "Common/HyperLink"
import { EditIcon } from "CommonIcons/EditIcon"
import { StyleLayoutProps } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";

export const ManageLibraryButton: React.FC<{ libraryId?: string }&StyleLayoutProps> = (props) => {
	const background = useBackgroundStyles();
	return <HyperLink to={`/Library/${props.libraryId}`} direction="row" className={background.button} {...props}><EditIcon /></HyperLink>;
};
