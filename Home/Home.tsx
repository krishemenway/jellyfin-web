import * as React from "react";
import { PageWithNavigation } from "PageWithNavigation";
import { HomeIcon } from "Home/HomeIcon";
import { PageTitle } from "Common/PageTitle";
import { Settings } from "Users/SettingsStore";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { Layout } from "Common/Layout";
import { ItemListViewOptions } from "ItemList/ItemListViewOptions";
import { ItemService } from "Items/ItemsService";
import { ListOf } from "Common/ListOf";
import { useBreakpointValues } from "AppStyles";
import { ItemsGridItem } from "ItemList/ItemGridItem";
import { useComputed, useObservable } from "@residualeffect/rereactor/lib";
import { BaseItemDto, CollectionType } from "@jellyfin/sdk/lib/generated-client/models";
import { HyperLink } from "Common/HyperLink";
import { EditIcon } from "CommonIcons/EditIcon";
import { Button } from "Common/Button";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { EditableField } from "Common/EditableField";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { AddIcon } from "CommonIcons/AddIcon";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { HomeViewOptions } from "Home/HomeViewOptions";
import { ArrowDownIcon } from "CommonIcons/ArrowDownIcon";
import { ArrowUpIcon } from "CommonIcons/ArrowUpIcon";
import { CollectionServiceFactory } from "Collections/CollectionTypeService";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { TranslatedText } from "Common/TranslatedText";

export const Home: React.FC = () => {
	return (
		<PageWithNavigation
			icon={<HomeIcon />}
			content={(libraries, _, settings) => <HomeWithSettings settings={settings} libraries={libraries} />}
		/>
	);
};

const HomeWithSettings: React.FC<{ settings: Settings; libraries: BaseItemDto[] }> = ({ settings, libraries }) => {
	const itemsPerRow = useBreakpointValues(2, 4, 6, 8);
	const homeViewOptions = React.useMemo(() => new HomeViewOptions(settings, libraries), [settings, libraries]);
	const isEditing = useObservable(homeViewOptions.IsEditing);
	const current = useObservable(homeViewOptions.ViewOptions);

	return (
		<Layout direction="column" py="1rem" gap="1rem" alignItems="center">
			<PageTitle text={({ Key: "Home" })} suppressOnScreen />
			{current.map((config, sectionIndex) => (
				<HomeSection
					key={config.Key}
					viewOptions={config}
					itemsPerRow={itemsPerRow}
					isEditing={isEditing}
					onDeleted={() => homeViewOptions.Remove(sectionIndex)}
					onMoveUp={sectionIndex > 0 ? () => homeViewOptions.Swap(sectionIndex, sectionIndex - 1) : undefined}
					onMoveDown={sectionIndex < current.length - 1 ? () => homeViewOptions.Swap(sectionIndex, sectionIndex + 1) : undefined}
				/>
			))}
			{!isEditing && <Button type="button" onClick={() => { homeViewOptions.IsEditing.Value = true; }} label="Edit" icon={<EditIcon />} justifyContent="center" alignItems="center" width="50%" gap=".5em" py=".25rem" />}
			{isEditing && (
				<Layout direction="column" minHeight="6rem" width="50%" gap="1rem" alignItems="center">
					<Layout direction="row" gap="1rem" width="50%">
						<AddHomeSectionButton currentOptions={current} homeViewOptions={homeViewOptions} />
					</Layout>

					<Layout direction="row" width="50%" gap=".5rem" alignItems="center" justifyContent="center">
						<Button type="button" onClick={() => { homeViewOptions.ViewOptionsKeys.Revert(); homeViewOptions.IsEditing.Value = false; }} icon={<RevertIcon />} px="4em" py=".25rem" />
						<Button type="button" onClick={() => { homeViewOptions.Save(); }} icon={<SaveIcon />} px="4em" py=".25rem" />
					</Layout>
				</Layout>
			)}
		</Layout>
	);
};

const AddHomeSectionButton: React.FC<{ currentOptions: ItemListViewOptions[]; homeViewOptions: HomeViewOptions; }> = ({ currentOptions, homeViewOptions }) => {
	const allOptions = useObservable(homeViewOptions.AllViewOptions);
	const filtered = React.useMemo(() => allOptions.filter((o) => !currentOptions.map(co => co.Key).includes(o.Key)), [allOptions, currentOptions]);
	const field = React.useMemo(() => new EditableField<ItemListViewOptions>("AddHomeSection", allOptions[0]), [homeViewOptions]);

	return (
		<>
			<AutoCompleteFieldEditor
				allOptions={filtered}
				field={field}
				getLabel={(o) => o.IsReadOnly ? <TranslatedText textKey={o.DefaultLabel?.Key ?? "Missing Default Label Key"} textProps={o.DefaultLabel?.KeyProps} /> : o.Label.Current.Value}
				getValue={(o) => o}
				getKey={(o => o.Key)}
			/>

			<Button
				label="Add" icon={<AddIcon />}
				alignItems="center" justifyContent="center" px="3em" py=".25em" gap=".5em"
				type="button" onClick={() => { homeViewOptions.ViewOptionsKeys.OnChange(homeViewOptions.ViewOptionsKeys.Current.Value.concat([field.Current.Value.BuildStorageKey()])); }}
			/>
		</>
	);
};

const HomeSection: React.FC<{ viewOptions: ItemListViewOptions; itemsPerRow: number; isEditing: boolean; onDeleted: () => void; onMoveUp?: () => void; onMoveDown?: () => void; }> = ({ viewOptions, itemsPerRow, isEditing, onDeleted, onMoveUp, onMoveDown }) => {
	const list = ItemService.Instance.FindOrCreateListFromSource(viewOptions.DataSource);
	const label = useObservable(viewOptions.Label.Current);

	React.useEffect(() => list.LoadWithAbort(), [viewOptions]);

	return (
		<Loading
			receivers={[list.List]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingSection label={label} itemsPerRow={itemsPerRow} viewOptions={viewOptions} />}
			whenNotStarted={<LoadingSection label={label} itemsPerRow={itemsPerRow} viewOptions={viewOptions} />}
			whenReceived={(itemWithStats) => <HomeSectionWithLoadedItems label={label} itemsFromList={itemWithStats.List} itemsPerRow={itemsPerRow} viewOptions={viewOptions} isEditing={isEditing} onDeleted={onDeleted} onMoveDown={onMoveDown} onMoveUp={onMoveUp} />}
		/>
	);
};

const LoadingSection: React.FC<{ label: string; itemsPerRow: number; viewOptions: ItemListViewOptions }> = ({ label, itemsPerRow, viewOptions }) => {
	const listUrl = showMoreLink(viewOptions);
	const items = React.useMemo(() => [].addCount(itemsPerRow),[itemsPerRow]);

	return (
		<Layout direction="column" gap=".25rem" width="100%">
			<Layout direction="row" justifyContent="space-between" fontSizeREM={1.3}>
				<HyperLink to={listUrl} direction="row" px=".25rem" py=".25rem" alignItems="end" children={label} />
			</Layout>

			<ListOf
				items={items}
				direction="row" wrap gap=".5em"
				forEachItem={(_, index) => (
					<Layout key={index} direction="column" backgroundColor="Panel" bt br bb bl alignItems="center" justifyContent="center" width={{ itemsPerRow: itemsPerRow, gap: ".5em" }} minHeight="15rem">
						<LoadingIcon size="2em" />
					</Layout>
				)}
			/>
		</Layout>
	);
};

function showMoreLink(viewOptions: ItemListViewOptions): string {
	switch(viewOptions.DataSource.DataSource) {
		case "Tag": {
			return `/Tags/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "Resume": {
			return `/Resume${!viewOptions.IsReadOnly ? "/" + viewOptions.Key : ""}`;
		}
		case "Favorites": {
			return `/Favorites${!viewOptions.IsReadOnly ? "/" + viewOptions.Key : ""}`;
		}
		case "Collection": {
			return `/Collection/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "Genre": {
			return `/Genres/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "Studio": {
			return `/Studio/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "Studios": {
			return `/Studios/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "MusicArtists": {
			return `/Music/Artists/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		case "MusicSongs": {
			return `/Music/Songs/${viewOptions.DataSource.DataSourceKey}/${viewOptions.Key}`;
		}
		default: {
			return `${CollectionServiceFactory.FindOrThrowByCollectionType(viewOptions.DataSource.DataSource as CollectionType).listUrl(viewOptions.DataSource.DataSourceKey)}/${viewOptions.Key}`;
		}
	}
}

const HomeSectionWithLoadedItems: React.FC<{ label: string; itemsFromList: BaseItemDto[]; viewOptions: ItemListViewOptions; itemsPerRow: number; isEditing: boolean; onDeleted: () => void; onMoveUp?: () => void; onMoveDown?: () => void; }> = ({ label, itemsFromList, viewOptions, itemsPerRow, isEditing, onDeleted, onMoveUp, onMoveDown }) => {
	const listUrl = showMoreLink(viewOptions);
	const filteredAndSortedItems = useComputed(() => {
		const filterFunc = viewOptions.FilterFunc.Value;
		const sortFunc = viewOptions.SortByFunc.Value;

		return itemsFromList.filter(filterFunc).sort(sortFunc);
	}, [itemsFromList, viewOptions]);

	return (
		<Layout direction="column" gap=".25rem" width="100%">
			<Layout direction="row" justifyContent="space-between" fontSizeREM={1.3}>
				<HyperLink to={listUrl} direction="row" px=".25rem" py=".25rem" alignItems="end" label={viewOptions.DefaultLabel} children={label} />
				{isEditing && (
					<Layout direction="row" gap="1rem">
						{onMoveDown && (
							<Button type="button" onClick={onMoveDown} icon={<ArrowDownIcon />} alignItems="center" justifyContent="center" px=".4rem" />
						)}

						{onMoveUp && (
							<Button type="button" onClick={onMoveUp} icon={<ArrowUpIcon />} alignItems="center" justifyContent="center" px=".4rem" />
						)}

						<Button type="button" onClick={onDeleted} icon={<DeleteIcon />} alignItems="center" justifyContent="center" px=".4rem" />
					</Layout>
				)}
			</Layout>

			<ListOf
				items={filteredAndSortedItems}
				direction="row" wrap gap=".5em"
				showMoreLimit={itemsPerRow} showMoreButtonStyles={{ display: "none" }}
				forEachItem={(item, index) => (
					<ItemsGridItem
						key={item.Id ?? index.toString()}
						item={item}
						itemsPerRow={itemsPerRow}
						getContent={BaseItemKindServiceFactory.FindOrThrow(item.Type).nameWithContext}
					/>
				)}
			/>
		</Layout>
	);
};
