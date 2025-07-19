import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { TextField } from "Common/TextField";
import { createStyles, useBackgroundStyles } from "Common/AppStyles";
import { AnchoredModal } from "Common/Modal";
import { SearchIcon } from "NavigationBar/SearchIcon";
import { SearchResults, SearchService } from "NavigationBar/SearchService";
import { Layout } from "Common/Layout";
import { Button } from "Common/Button";
import { CloseIcon } from "Common/CloseIcon";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { IconForItemType } from "Items/IconForItemType";
import { InfinityIcon } from "NavigationBar/InfinityIcon";
import { LinkToItem } from "Items/LinkToItem";
import { ItemImage } from "Items/ItemImage";
import { ListOf } from "Common/ListOf";
import { TranslatedText } from "Common/TranslatedText";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";

const useSearchStyles = createStyles({
	searchIcon: {
		position: "absolute",
		left: 8,
	},
	queryField: {
		borderRadius: "2em",
		outlineStyle: "none",
	},
});

const LoadedSearchResults: React.FC<{ results: SearchResults }> = (props) => {
	const selectedType = useObservable(props.results.SelectedType);
	const selectedItems = useObservable(props.results.SelectedItems);
	const query = useObservable(SearchService.Instance.SearchTermField.Current);

	return (
		<Layout direction="row">
			<Layout direction="column">
				{props.results.AllTypes.length > 1 && (
					<Button px={8} py={8} direction="row" key="All" type="button" selected={selectedType === undefined} onClick={() => props.results.SelectedType.Value = undefined}><InfinityIcon size={24} /></Button>
				)}

				{props.results.AllTypes.map((type) => (
					<Button px={8} py={8} direction="row" key={type} type="button" selected={selectedType === type} onClick={() => props.results.SelectedType.Value = type}><IconForItemType itemType={type} size={24} /></Button>
				))}
			</Layout>

			<ListOf
				items={selectedItems}
				createKey={(item, index) => item.Id ?? index.toString()}
				listLayout={{ direction: "column" }}
				listItemLayout={{ direction: "row", py: 8, px: 8 }}
				emptyListView={<TranslatedText textKey="SearchResultsEmpty" textProps={[query]} elementType="div" layout={{ px: 8, py: 8 }} />}
				renderItem={(item) => (
					<LinkToItem key={item.Id} item={item} direction="row" height={24} gap={16}>
						<ItemImage item={item} type="Primary" />
						<Layout direction="row">{item.Name}</Layout>
					</LinkToItem>
				)}
			/>
		</Layout>
	);
};

export const Search: React.FC = () => {
	const [textRef, setTextRef] = React.useState<HTMLInputElement|null>(null);
	const resultsVisible = useObservable(SearchService.Instance.ResultsVisible);
	const background = useBackgroundStyles();
	const searchStyles = useSearchStyles();

	return (
		<Layout direction="row" alignItems="center" position="relative">
			<SearchIcon className={searchStyles.searchIcon} size="20" />
			<TextField px={32} py={4} className={`${background.field} ${searchStyles.queryField}`} field={SearchService.Instance.SearchTermField} ref={(r) => { setTextRef(r); return r; }} />

			<AnchoredModal
				anchorElement={textRef}
				open={(textRef ?? false) && resultsVisible}
				onClosed={() => SearchService.Instance.Clear()}
				anchorAlignment={{ horizontal: "left", vertical: "bottom" }}>
				<Layout direction="column" className={background.panel} minHeight={300} minWidth={320} maxWidth={500}>
					<Layout direction="row" justifyContent="space-between" px={8} py={8}>
						<Layout direction="row" alignItems="center">Search Results</Layout>
						<Button direction="row" alignItems="center" type="button" onClick={() => SearchService.Instance.Clear()}><CloseIcon size={24} /></Button>
					</Layout>

					<Loading
						receivers={[SearchService.Instance.Results]}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenLoading={<LoadingIcon my={32} alignSelf="center" size={48} />}
						whenNotStarted={<LoadingIcon my={32} alignSelf="center" size={48} />}
						whenReceived={(results) => <LoadedSearchResults results={results} />}
					/>
				</Layout>
			</AnchoredModal>
		</Layout>
	);
};
