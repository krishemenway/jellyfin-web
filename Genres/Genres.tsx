import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { Loading } from "Common/Loading";
import { ItemFilterService } from "Items/ItemFilterService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { HyperLink } from "Common/HyperLink";
import { PageTitle } from "Common/PageTitle";
import { Layout } from "Common/Layout";

export const Genres: React.FC = () => {
	return (
		<PageWithNavigation icon="Genre" content={(libraries) => (
			<Layout direction="column" gap="2em" py="1em">
				<PageTitle text={{ Key: "Genres" }} />
				<GenresForLibraries libraries={libraries} />
			</Layout>
		)} />
	);
};

const GenresForLibraries: React.FC<{ libraries: BaseItemDto[] }> = (props) => {
	const receiver = ItemFilterService.Instance.FindOrCreateFiltersReceiver(props.libraries.map((l) => l.Id ?? ""));

	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort(props.libraries.map((l) => l.Id ?? "")), [props.libraries])

	return (
		<Loading
			receivers={[receiver]}
			whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
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
