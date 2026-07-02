import * as React from "react";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";
import { Loading } from "Common/Loading";
import { ItemFilterService } from "Items/ItemFilterService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { TagLink } from "Tags/TagLink";
import { Layout } from "Common/Layout";

export const Tags: React.FC = () => {
	return (
		<PageWithNavigation icon={<TagIcon />} content={(libraries) => (
			<Layout direction="column" grow alignItems="center" justifyContent="center">
				<TagsForLibraries libraries={libraries} />
			</Layout>
		)} />
	);
};

const TagsForLibraries: React.FC<{ libraries: BaseItemDto[] }> = (props) => {
	const loadTags = () => ItemFilterService.Instance.LoadFiltersWithAbort(props.libraries.map((l) => l.Id ?? ""));

	React.useEffect(() => loadTags(), [props.libraries])

	return (
		<Loading
			receivers={[ItemFilterService.Instance.FindOrCreateFiltersReceiver(props.libraries.map((l) => l.Id ?? ""))]}
			whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} retryAction={loadTags} />}
			whenReceived={(filters) => (
				<ListOf
					direction="row" wrap gap=".5em" py="1em"
					items={filters.Tags ?? []}
					forEachItem={(item) => (
						<TagLink key={item} tag={item} direction="row" px=".25em" py=".25em" />
					)}
				/>
			)}
		/>
	);
};
