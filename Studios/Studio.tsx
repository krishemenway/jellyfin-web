import * as React from "react";
import { useParams } from "react-router-dom";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ItemService } from "Items/ItemsService";
import { NotFound } from "Common/NotFound";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { PageTitle } from "Common/PageTitle";

export const Studio: React.FC = () => {
	const studioId = useParams().studioId;

	if (!Nullable.HasValue(studioId)) {
		return <PageWithNavigation icon="Studio"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(studioId).LoadItemWithAbort(), [studioId]);

	return (
		<PageWithNavigation icon="Studio">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(studioId).Item]}
				whenNotStarted={<LoadingIcon size="3em" />}
				whenLoading={<LoadingIcon size="3em" />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(studio) => (
					<Layout direction="row" gap="1em" py="1em">
						<PageTitle text={studio.Name} />
						<Layout elementType="h1" direction="row" fontSize="1.5em">{studio.Name}</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	)
};
