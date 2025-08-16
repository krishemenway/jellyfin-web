import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { Loading } from "Common/Loading";
import { ItemFilterService } from "Items/ItemFilterService";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { UserViewStore } from "Users/UserViewStore";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";

export const Genres: React.FC = () => {
	return (
		<PageWithNavigation icon="Genre">
			<Layout direction="column" gap="2em" py="1em">
				<PageTitle text={{ Key: "Genres" }} />
				<Loading
					receivers={[UserViewStore.Instance.UserViews]}
					whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
					whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
					whenReceived={(libraries) => <GenresForLibraries libraries={libraries} />}
				/>
			</Layout>
		</PageWithNavigation>
	);
};

const GenresForLibraries: React.FC<{ libraries: BaseItemDto[] }> = (props) => {
	const receiver = ItemFilterService.Instance.FindOrCreateFiltersReceiver(props.libraries.map((l) => l.Id ?? ""));

	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort(props.libraries.map((l) => l.Id ?? "")), [props.libraries])

	return (
		<Loading
			receivers={[receiver]}
			whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
			whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenReceived={(filters) => (
				<ListOf
					direction="row" wrap gap=".5em" py="1em"
					items={filters.Genres ?? []}
					forEachItem={(item) => <HyperLink key={item} to={`/Genres/${item}`} direction="row" px=".25em" py=".25em" children={item} />}
				/>
			)}
		/>
	);
};
