import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { TextField } from "Common/TextField";
import { createStyles, useBackgroundStyles } from "AppStyles";
import { AnchoredModal } from "Common/Modal";
import { SearchIcon } from "NavigationBar/SearchIcon";
import { SearchResults, SearchService } from "NavigationBar/SearchService";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { IconForItemKind } from "Items/IconForItemKind";
import { InfinityIcon } from "NavigationBar/InfinityIcon";
import { LinkToItem } from "Items/LinkToItem";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { Virtuoso } from "react-virtuoso";

export const Search: React.FC = () => {
	const [textRef, setTextRef] = React.useState<HTMLInputElement|null>(null);
	const resultsVisible = useObservable(SearchService.Instance.ResultsVisible);
	const background = useBackgroundStyles();
	const searchStyles = useSearchStyles();

	return (
		<Layout direction="row" alignItems="center" position="relative">
			<SearchIcon className={searchStyles.searchIcon} size="20" />
			<TextField px="2em" py=".25em" className={`${background.field} ${searchStyles.queryField}`} field={SearchService.Instance.SearchTermField} ref={(r) => { setTextRef(r); return r; }} />

			<AnchoredModal
				alternatePanel
				anchorElement={textRef}
				open={(textRef ?? false) && resultsVisible}
				onClosed={() => { }}
				opensInDirection="right"
			>
				<Layout direction="column" className={background.panel} minHeight="22em" minWidth="25em">
					<Layout direction="row" justifyContent="space-between" px=".5em" py=".5em" bb>
						<Layout direction="row" alignItems="center" fontSize="1.5em">Search Results</Layout>
						<Button className={background.transparent} direction="row" alignItems="center" type="button" onClick={() => SearchService.Instance.Clear()} icon={<CloseIcon size="2em" />} />
					</Layout>

					<Loading
						receivers={[SearchService.Instance.Results]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon alignSelf="center" size="3em" />}
						whenNotStarted={<LoadingIcon alignSelf="center" size="3em" />}
						whenReceived={(results) => <LoadedSearchResults results={results} />}
					/>
				</Layout>
			</AnchoredModal>
		</Layout>
	);
};

const LoadedSearchResults: React.FC<{ results: SearchResults }> = (props) => {
	const selectedType = useObservable(props.results.SelectedType);
	const selectedItems = useObservable(props.results.SelectedItems);

	return (
		<Layout direction="row" grow>
			<Layout direction="column" fontSize="1.25em">
				<Button transparent px=".5em" py=".5em" direction="row" key="All" type="button" selected={selectedType === undefined} onClick={() => props.results.SelectedType.Value = undefined} icon={<InfinityIcon />} />

				{props.results.AllTypes.map((type) => (
					<Button transparent px=".5em" py=".5em" direction="row" key={type} type="button" selected={selectedType === type} onClick={() => props.results.SelectedType.Value = type} icon={<IconForItemKind itemKind={type} />} />
				))}
			</Layout>

			<Layout direction="column" grow>
				<Virtuoso
					data={selectedItems}
					totalCount={selectedItems.length}
					itemContent={(_, result) => <SearchResult item={result} />}
					style={{ width: "100%", height: "100%" }}
				/>
			</Layout>
		</Layout>
	);
};

const SearchResult: React.FC<{ item: BaseItemDto }> = (props) => {
	const searchResultNameFunc = BaseItemKindServiceFactory.FindOrNull(props.item.Type)?.searchResultName ?? ((item) => item.Name);

	return (
		<LinkToItem item={props.item} direction="row" alignItems="center" gap="1em" px=".5em" py=".5em" justifyContent="space-between">
			<Layout direction="column">{searchResultNameFunc(props.item)}</Layout>
			<Layout direction="column"><IconForItemKind itemKind={props.item.Type} /></Layout>
		</LinkToItem>
	);
};

const useSearchStyles = createStyles({
	searchIcon: {
		position: "absolute",
		left: ".5em",
	},
	queryField: {
		borderRadius: "2em",
		outlineStyle: "none",
	},
});
