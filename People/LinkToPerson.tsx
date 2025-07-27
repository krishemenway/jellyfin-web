import * as React from "react";
import { StyleLayoutPropsWithRequiredDirection } from "Common/Layout";
import { HyperLink } from "Common/HyperLink";

export const LinkToPerson: React.FC<{ id: string|undefined; className?: string; children: React.ReactNode }&StyleLayoutPropsWithRequiredDirection> = (props) => {
	if (props.id === undefined) {
		throw new Error("Cannot link to person missing id");
	}

	return <HyperLink to={`/Person/${props.id}`} {...props} />;
};
