import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { TagIcon } from "Tags/TagIcon";
import { Loading } from "Common/Loading";
import { ItemFilterService } from "Items/ItemFilterService";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { UserViewStore } from "Users/UserViewStore";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { TagLink } from "Tags/TagLink";
import { Layout } from "Common/Layout";

export const Tags: React.FC = () => {
	return (
		<PageWithNavigation icon={<TagIcon />}>
			<Layout direction="column" grow alignItems="center" justifyContent="center">
				<Loading
					receivers={[UserViewStore.Instance.UserViews]}
					whenNotStarted={<LoadingIcon size="3em" />}
					whenLoading={<LoadingIcon size="3em" />}
					whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
					whenReceived={(libraries) => <TagsForLibraries libraries={libraries} />}
				/>
			</Layout>
		</PageWithNavigation>
	);
};

const TagsForLibraries: React.FC<{ libraries: BaseItemDto[] }> = (props) => {
	const receiver = ItemFilterService.Instance.FindOrCreateFiltersReceiver(props.libraries.map((l) => l.Id ?? ""));

	React.useEffect(() => ItemFilterService.Instance.LoadFiltersWithAbort(props.libraries.map((l) => l.Id ?? "")), [props.libraries])

	return (
		<Loading
			receivers={[receiver]}
			whenNotStarted={<LoadingIcon size="3em" />}
			whenLoading={<LoadingIcon size="3em" />}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
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
