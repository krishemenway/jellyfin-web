import * as React from "react";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { Layout } from "Common/Layout";
import { Nullable } from "./MissingJavascriptFunctions";
import { Button } from "./Button";
import { RetryIcon } from "CommonIcons/RetryIcon";
import { ServerService } from "Servers/ServerService";
import { UserViewStore } from "Users/UserViewStore";
import { QuickConnectService } from "Users/QuickConnect";
import { LoginService } from "Users/LoginService";

function reloadPageRequirements(): void {
	LoginService.Instance.LoadUser();
	UserViewStore.Instance.LoadUserViewsWithAbort(ServerService.Instance.CurrentUserId.Value);
	ServerService.Instance.LoadServerInfoWithAbort();
	QuickConnectService.Instance.LoadQuickConnectEnabled();
}

export const LoadingErrorMessages: React.FC<{ errorTextKeys: string[]; retryAction?: () => void; }> = ({ errorTextKeys, retryAction }) => {
	return (
		<Layout direction="column" gap="1rem" alignItems="center" justifyContent="center" py="1rem" height="100%">
			<ListOf
				items={errorTextKeys.distinct()}
				direction="column" gap="1em"
				forEachItem={(textKey) => <TranslatedText key={textKey} textKey={textKey} elementType="div" layout={{ textAlign: "center", justifyContent: "center" }} />}
			/>

			{Nullable.HasValue(retryAction) && (
				<Button type="button" onClick={() => { retryAction(); reloadPageRequirements(); }} label={{ Key: "ButtonTryAgain" }} icon={<RetryIcon />} gap=".5em" py=".25em" alignItems="center" justifyContent="center" width="15rem" />
			)}
		</Layout>
	);
};
