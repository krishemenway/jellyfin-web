import * as React from "react";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";

export const NotFound: React.FC = () => <LoadingErrorMessages errorTextKeys={["HeaderPageNotFound"]} />;
