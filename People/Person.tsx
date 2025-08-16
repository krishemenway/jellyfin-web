import * as React from "react";
import { parseISO, intervalToDuration } from "date-fns";
import { useParams } from "react-router-dom";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { NotFound } from "Common/NotFound";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { TranslatedText } from "Common/TranslatedText";
import { ItemImage } from "Items/ItemImage";
import { ItemService } from "Items/ItemsService";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { useBackgroundStyles } from "AppStyles";
import { LinkToItem } from "Items/LinkToItem";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";
import { ItemOverview } from "Items/ItemOverview";
import { LoginService } from "Users/LoginService";
import { AddToFavoritesAction } from "MenuActions/AddToFavoritesAction";
import { PageTitle } from "Common/PageTitle";
import { Virtuoso } from "react-virtuoso";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { AddToCollectionAction } from "MenuActions/AddToCollectionAction";
import { EditItemAction } from "MenuActions/EditItemAction";
import { IconForItem } from "Items/IconForItem";
import { SortFuncs } from "Common/Sort";
import { SortByProductionYear } from "ItemList/ItemSortTypes/SortByProductionYear";
import { ItemsApiGetItemsRequest } from "@jellyfin/sdk/lib/generated-client/api/items-api";
import { CreateSortFunc } from "ItemList/ItemSortOption";

const BaseCreditRequestData: Partial<ItemsApiGetItemsRequest> = {
	imageTypeLimit: 1,
	enableTotalRecordCount: true,
	recursive: true,
	includeItemTypes: [ "Audio", "Movie", "Episode", "AudioBook", "Photo", "Video"],
};

const CreditSortOrder: SortFuncs<BaseItemDto>[] = [CreateSortFunc(SortByProductionYear, true)];

export const Person: React.FC = () => {
	const personId = useParams().personId;
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(personId)) {
		return <PageWithNavigation icon="Person"><NotFound /></PageWithNavigation>;
	}

	const personData = ItemService.Instance.FindOrCreateItemData(personId);

	React.useEffect(() => personData.LoadItemWithAbort(), [personData]);
	React.useEffect(() => personData.LoadChildrenWithAbort(false, { ...BaseCreditRequestData, ...{ personIds: [ personId ] }}, CreditSortOrder), [personData]);

	return (
		<PageWithNavigation icon="Person" key={personId}>
			<Loading
				receivers={[personData.Item, personData.Children, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
				whenReceived={(person, creditedItems, user) => (
					<Layout direction="row" gap="1em" py="1em" height="100%">
						<Layout direction="column" maxWidth="20%" gap=".5em">
							<ItemImage item={person} type="Primary" />

							<ItemExternalLinks
								item={person}
								direction="row" gap=".5em"
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: ".5em", justifyContent: "center", grow: 1 }}
							/>
						</Layout>

						<Layout direction="column" grow gap="1.5em">
							<Layout direction="row" justifyContent="space-between">
								<PageTitle text={person.Name} />
								<ItemActionsMenu items={[person]} user={user} actions={[[
									AddToFavoritesAction,
									AddToCollectionAction,
									EditItemAction,
								]]} />
							</Layout>

							<PersonDetails person={person} />

							<Virtuoso
								data={creditedItems}
								totalCount={creditedItems.length}
								itemContent={(_, item) => <CreditedItem creditedItem={item} person={person} />}
								style={{ height: "100%", width: "100%" }}
							/>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

const CreditedItem: React.FC<{ creditedItem: BaseItemDto, person: BaseItemDto }> = ({ creditedItem, person }) => {
	const creditedNameFuncForType = BaseItemKindServiceFactory.FindOrNull(creditedItem.Type)?.personCreditName ?? ((i) => i.Name);

	return (
		<LinkToItem direction="row" alignItems="center" item={creditedItem} gap=".25em" py=".5em">
			<Layout direction="column" px="1em" py=".25em"><IconForItem item={creditedItem} /></Layout>

			<Layout direction="column" grow gap=".25em">
				<Layout direction="row">{creditedNameFuncForType(creditedItem)}</Layout>
				<Layout direction="row">{creditedItem.People?.find(x => x.Id === person.Id)?.Role}</Layout>
			</Layout>

			<Layout direction="column" width="5%" px="1em" alignItems="end" justifyContent="center">{creditedItem.ProductionYear}</Layout>
		</LinkToItem>
	);
};

const PersonDetails: React.FC<{ person: BaseItemDto }> = (props) => {
	if (!props.person.PremiereDate) {
		return <></>;
	}

	const birthday = parseISO(props.person.PremiereDate);
	const deathOrNow = !props.person.EndDate ? new Date(Date.now()) : parseISO(props.person.EndDate);
	const ageAtDeathOrNow = intervalToDuration({ start: birthday, end: deathOrNow });

	return (
		<Layout direction="column" gap="1em">
			<Layout direction="row" alignItems="center" gap=".5em">
				<TranslatedText textKey="BirthDateValue" textProps={[birthday.toLocaleDateString()]} elementType="div" className="birthDate" />

				{!props.person.EndDate && (
					<Layout direction="row" className="age">({ageAtDeathOrNow.years})</Layout>
				)}

				{!!props.person.ProductionLocations && !!props.person.ProductionLocations[0] && (
					<Layout direction="row" className="birthLocation">@ {props.person.ProductionLocations[0]}</Layout>
				)}
			</Layout>

			{!!props.person.EndDate && (
				<Layout direction="row" className="deathDateAndDeathAge">
					<TranslatedText textKey="DeathDateValue" textProps={[deathOrNow.toLocaleDateString()]} />
					<TranslatedText textKey="AgeValue" textProps={[ageAtDeathOrNow.years?.toString() ?? ""]} />
				</Layout>
			)}

			<ItemOverview item={props.person} />
		</Layout>
	);
};
