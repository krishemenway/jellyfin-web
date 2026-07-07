import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { TextField } from "Common/TextField";
import { createStyles } from "AppStyles";
import { AnchoredModal } from "Common/Modal";
import { SearchIcon } from "Search/SearchIcon";
import { SearchResults, SearchService } from "Search/SearchService";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { CloseIcon } from "CommonIcons/CloseIcon";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { IconForItemKind } from "Items/IconForItemKind";
import { InfinityIcon } from "CommonIcons/InfinityIcon";
import { LinkToItem } from "Items/LinkToItem";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { BaseItemKindServiceFactory, defaultNameFunc } from "Items/BaseItemKindServiceFactory";
import { Virtuoso } from "react-virtuoso";
import { TranslatedText } from "Common/TranslatedText";

export const Search: React.FC<{ disabled?: boolean; }> = ({ disabled }) => {
	const [textRef, setTextRef] = React.useState<HTMLInputElement|null>(null);
	const resultsVisible = useObservable(SearchService.Instance.ResultsVisible);
	const searchStyles = useSearchStyles();

	return (
		<Layout direction="row" alignItems="center" position="relative">
			<SearchIcon classes={[searchStyles.searchIcon]} size="20" />
			<TextField px="2em" py=".25em" classes={[searchStyles.queryField]} field={SearchService.Instance.SearchTermField} ref={(r) => { setTextRef(r); }} disabled={disabled} bt br bb bl backgroundColor="Field" />

			<AnchoredModal
				anchorElement={textRef}
				open={(textRef ?? false) && resultsVisible}
				onClosed={() => { SearchService.Instance.Clear(); }}
				opensInDirection="right"
			>
				<Layout direction="column" minHeight="22em" minWidth="25em" gap=".25rem">
					<Layout br bt bl bb backgroundColor="AlternatePanel" direction="row" justifyContent="space-between" px=".5em" py=".5em" fontSizeREM={1.2}>
						<Layout direction="row" alignItems="center"><TranslatedText textKey="SearchResults" /></Layout>
						<Button type="button" onClick={() => SearchService.Instance.Clear()} icon={<CloseIcon />} transparent direction="row" alignItems="center" px=".25em" py=".25em" />
					</Layout>

					<Loading
						receivers={[SearchService.Instance.Results]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<Layout br bt bl bb backgroundColor="AlternatePanel" direction="column" alignItems="center" justifyContent="center" grow><LoadingIcon size="3em" /></Layout>}
						whenNotStarted={<Layout br bt bl bb backgroundColor="AlternatePanel" direction="column" alignItems="center" justifyContent="center" grow><LoadingIcon size="3em" /></Layout>}
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
		<Layout direction="row" grow gap=".25rem">
			{props.results.AllItems.length === 0 ? (
				<Layout br bt bl bb backgroundColor="AlternatePanel" direction="row" alignItems="center" justifyContent="center" grow width="100%">
					<TranslatedText textKey="NoSubtitleSearchResultsFound" />
				</Layout>
			) : (
				<>
				{props.results.AllTypes.length > 1 && (
					<Layout br bt bl bb backgroundColor="AlternatePanel" direction="column" fontSizeREM={1.25}>
						<Button transparent px=".5em" py=".5em" direction="row" key="All" type="button" selected={selectedType === undefined} onClick={() => props.results.SelectedType.Value = undefined} icon={<InfinityIcon />} />

						{props.results.AllTypes.map((type) => (
							<Button transparent px=".5em" py=".5em" direction="row" key={type} type="button" selected={selectedType === type} onClick={() => props.results.SelectedType.Value = type} icon={<IconForItemKind itemKind={type} />} />
						))}
					</Layout>
				)}

				<Layout direction="column" grow br bt bl bb backgroundColor="AlternatePanel">
					<Virtuoso
						data={selectedItems}
						totalCount={selectedItems.length}
						itemContent={(_, result) => <SearchResult item={result} />}
						style={{ width: "100%", height: "100%" }}
					/>
				</Layout>
				</>
			)}
		</Layout>
	);
};

const SearchResult: React.FC<{ item: BaseItemDto }> = (props) => {
	const nameFunc = BaseItemKindServiceFactory.FindOrNull(props.item.Type)?.nameWithContext ?? defaultNameFunc;

	return (
		<LinkToItem item={props.item} direction="row" alignItems="center" gap="1em" px=".5em" py=".5em" justifyContent="space-between" onClick={() => { SearchService.Instance.Clear(); }}>
			<Layout direction="column">{nameFunc(props.item)}</Layout>
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
