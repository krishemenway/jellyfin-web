import * as React from "react";
import { intervalToDuration } from "date-fns";
import { useParams } from "react-router-dom";
import { BaseItemDto, UserDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { NotFound } from "Common/NotFound";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { TranslatedText } from "Common/TranslatedText";
import { ItemImage } from "Items/ItemImage";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation, PageIsLoading } from "PageWithNavigation";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { useBackgroundStyles } from "AppStyles";
import { LinkToItem } from "Items/LinkToItem";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { BaseItemKindServiceFactory, defaultNameFunc } from "Items/BaseItemKindServiceFactory";
import { ItemOverview } from "Items/ItemOverview";
import { LoginService } from "Users/LoginService";
import { AddToFavoritesAction, RemoveFromFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { ItemPageTitle } from "Items/ItemPageTitle";
import { Virtuoso } from "react-virtuoso";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { IconForItem } from "Items/IconForItem";
import { SortByPremiereDate } from "ItemList/ItemSortTypes/SortByPremiereDate";
import { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api/items-api";
import { ChangeImageButton } from "Items/ChangeImageButton";
import { useObservable } from "@residualeffect/rereactor";
import { ItemEditorService, useEditableItem } from "Items/ItemEditorService";
import { EditableItemProps } from "Items/EditableItemProps";
import { Button } from "Common/Button";
import { RevertIcon } from "CommonIcons/RevertIcon";
import { SaveIcon } from "CommonIcons/SaveIcon";
import { SortByIndexNumber } from "ItemList/ItemSortTypes/SortByIndexNumber";
import { DateField, TextField } from "Common/TextField";
import { FieldLabel } from "Common/FieldLabel";
import { ItemTags } from "Items/ItemTags";
import { ReverseSort, SortFunc } from "Common/ArrayPrototype";

const BaseCreditRequestData: Partial<ItemsApiGetItemsRequest> = {
	imageTypeLimit: 1,
	enableTotalRecordCount: true,
	recursive: true,
	includeItemTypes: [ "Audio", "Movie", "Episode", "AudioBook", "Photo", "Video", "MusicVideo"],
};

const CreditSortOrder: SortFunc<BaseItemDto>[] = [ReverseSort(SortByPremiereDate.sortFunc), ReverseSort(SortByIndexNumber.sortFunc)];

export const Person: React.FC = () => {
	const personId = useParams().personId;

	if (!Nullable.HasValue(personId)) {
		return <PageWithNavigation icon="Person"><NotFound /></PageWithNavigation>;
	}

	const personData = ItemService.Instance.FindOrCreateItemData(personId);

	React.useEffect(() => personData.LoadItemWithAbort(), [personData]);
	React.useEffect(() => personData.LoadChildrenWithAbort(false, { ...BaseCreditRequestData, ...{ personIds: [ personId ] }}, CreditSortOrder), [personData]);

	return (
		<PageWithNavigation icon="Person" key={personId} matchHeight>
			<Loading
				receivers={[personData.Item, personData.Children, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<PageIsLoading />} whenNotStarted={<PageIsLoading />}
				whenReceived={(person, creditedItems, user) => <LoadedPerson person={person} creditedItems={creditedItems} user={user} reloadPerson={() => personData.LoadItemWithAbort(true)} />}
			/>
		</PageWithNavigation>
	);
};

const LoadedPerson: React.FC<{ person: BaseItemDto; creditedItems: BaseItemDto[]; user: UserDto; reloadPerson: () => void; }> = ({ person, creditedItems, user, reloadPerson }) => {
	const background = useBackgroundStyles();
	const editableItem = useEditableItem(person, user);
	const isEditing = useObservable(ItemEditorService.Instance.IsEditing);

	return (
		<Layout direction="row" gap="1em" py="1em" height="100%">
			<Layout direction="column" maxWidth="20%" gap=".5em">
				<Layout direction="column">
					<ItemImage item={person} type="Primary" />
					<ChangeImageButton item={person} imageType="Primary" label="ButtonChangeImage" onChanged={() => ItemService.Instance.FindOrCreateItemData(person.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
					<ChangeImageButton item={person} imageType="Backdrop" label="ButtonChangeBackdrop" onChanged={() => ItemService.Instance.FindOrCreateItemData(person.Id!).LoadItemWithAbort(true)} isEditing={isEditing} />
				</Layout>

				<ItemExternalLinks
					item={person}
					direction="row" gap=".5em"
					linkClassName={background.button}
					linkLayout={{ direction: "row", width: "100%", py: ".5em", justifyContent: "center", grow: 1 }}
					isEditing={isEditing} editableItem={editableItem}
				/>
			</Layout>

			<Layout direction="column" grow gap="1.5em">
				<Layout direction="row" justifyContent="space-between" gap="1rem">
					<ItemPageTitle item={person} isEditing={isEditing} editableItem={editableItem} />
					<Layout direction="row" gap="1rem">
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<RevertIcon />} onClick={() => { ItemEditorService.Instance.Cancel(); }} />}
						{isEditing && <Button type="button" alignItems="center" px=".5em" py=".5em" icon={<SaveIcon />} onClick={() => { ItemEditorService.Instance.Save(reloadPerson); }} />}
						<ItemActionsMenu reloadItems={() => reloadPerson()} items={[person]} user={user} actions={[[
							AddToFavoritesAction,
							RemoveFromFavoritesAction,
							AddToCollectionAction,
							EditItemAction,
						]]} />
					</Layout>
				</Layout>

				<PersonDetails person={person} isEditing={isEditing} editableItem={editableItem} />

				<Virtuoso
					data={creditedItems}
					totalCount={creditedItems.length}
					itemContent={(_, item) => <CreditedItem creditedItem={item} person={person} />}
					style={{ height: "100%", width: "100%" }}
				/>
			</Layout>
		</Layout>
	)
}

const CreditedItem: React.FC<{ creditedItem: BaseItemDto, person: BaseItemDto }> = ({ creditedItem, person }) => {
	const nameFunc = BaseItemKindServiceFactory.FindOrNull(creditedItem.Type)?.nameWithContext ?? defaultNameFunc;
	const personRecord = creditedItem.People?.find(x => x.Id === person.Id);

	return (
		<LinkToItem direction="row" alignItems="center" item={creditedItem} gap=".25em" py=".5em">
			<Layout direction="column" px="1em" py=".25em"><IconForItem item={creditedItem} /></Layout>

			<Layout direction="column" grow gap=".25em">
				<Layout direction="row">{nameFunc(creditedItem)}</Layout>
				<Layout direction="row">{[personRecord?.Role, personRecord?.Type].coalesce("", Nullable.StringHasValue)}</Layout>
			</Layout>

			<Layout direction="column" width="5%" px="1em" alignItems="end" justifyContent="center">{creditedItem.ProductionYear}</Layout>
		</LinkToItem>
	);
};

const PersonDetails: React.FC<{ person: BaseItemDto }&EditableItemProps> = ({ person, isEditing, editableItem }) => {
	const background = useBackgroundStyles();
	const birthday = Nullable.Value(person.PremiereDate, new Date(Date.now()), (d) => DateTime.ParseWithoutZone(d));
	const deathOrNow = Nullable.Value(person.EndDate, new Date(Date.now()), (d) => DateTime.ParseWithoutZone(d));
	const ageAtDeathOrNow = intervalToDuration({ start: birthday, end: deathOrNow });

	return (
		<Layout direction="column" gap="1em">
			{Nullable.HasValue(editableItem) && isEditing ? (
				<Layout direction="row" alignItems="center" gap=".5em">
					<FieldLabel field={editableItem.PremiereDate} textKey="LabelBirthDate" />
					<DateField field={editableItem.PremiereDate} px=".5em" py=".25em" />

					<FieldLabel field={editableItem.ProductionLocation} textKey="BirthLocation" />
					<TextField field={editableItem.ProductionLocation} px=".5em" py=".25em" />
				</Layout>
			) : Nullable.HasValue(person.PremiereDate) ? (
				<Layout direction="row" alignItems="center" gap=".5em">
					<TranslatedText textKey="BirthDateValue" textProps={[birthday.toLocaleDateString()]} elementType="div" className="birthDate" />

					{!Nullable.HasValue(person.EndDate) && (
						<Layout direction="row" className="age">({ageAtDeathOrNow.years})</Layout>
					)}

					{!!person.ProductionLocations && !!person.ProductionLocations[0] && (
						<Layout direction="row" className="birthLocation">@ {person.ProductionLocations[0]}</Layout>
					)}
				</Layout>
			) : (
				<></>
			)}

			{Nullable.HasValue(editableItem) && isEditing ? (
				<Layout direction="row" className="deathDateAndDeathAge">
					<FieldLabel field={editableItem.EndDate} textKey="LabelDeathDate" />
					<DateField field={editableItem.EndDate} px=".5em" py=".25em" />
				</Layout>
			) : Nullable.HasValue(person.EndDate) ? (
				<Layout direction="row" className="deathDateAndDeathAge">
					<TranslatedText textKey="DeathDateValue" textProps={[deathOrNow.toLocaleDateString()]} />
					<TranslatedText textKey="AgeValue" textProps={[ageAtDeathOrNow.years?.toString() ?? ""]} />
				</Layout>
			) : (
				<></>
			)}

			<ItemOverview item={person} isEditing={isEditing} editableItem={editableItem} />
			<ItemTags
				item={person}
				isEditing={isEditing} editableItem={editableItem}
				direction="row" gap=".5em" wrap
				linkClassName={background.button}
				linkLayout={{ px: ".25em", py: ".25em" }}
				showMoreLimit={25}
			/>
		</Layout>
	);
};
