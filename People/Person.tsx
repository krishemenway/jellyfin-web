import * as React from "react";
import { parseISO, intervalToDuration } from "date-fns";
import { useParams } from "react-router-dom";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { Layout } from "Common/Layout";
import { Loading } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import { NotFound } from "Common/NotFound";
import { ServerService } from "Servers/ServerService";
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

class PersonData {
	constructor(id: string) {
		this.Id = id;
		this.Person = ItemService.Instance.FindOrCreateItemData(id).Item;
		this.CreditedItems = new Receiver("UnknownError");
	}

	public Load(): () => void {
		ItemService.Instance.FindOrCreateItemData(this.Id).LoadItemWithAbort();
		this.CreditedItems.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: 100, enableUserData: true, imageTypeLimit: 1, enableTotalRecordCount: true, fields: ["MediaSourceCount"], personIds: [this.Id], recursive: true, userId: ServerService.Instance.CurrentUserId, includeItemTypes: [ "Audio", "Movie", "Episode", "AudioBook", "Photo", "Video"] }, { signal: a.signal }).then((response) => {
			return response.data.Items?.sort((a, b) => (b.ProductionYear ?? 10000) - (a.ProductionYear ?? 10000)) ?? [];
		}));

		return () => {
			this.Person.ResetIfLoading();
			this.CreditedItems.ResetIfLoading();
		};
	}

	public Id: string;
	public Person: Receiver<BaseItemDto>;
	public CreditedItems: Receiver<BaseItemDto[]>;
}

class PersonService {
	constructor() {
		this.PersonDataById = {};
	}

	public TryLoadPersonForId(id?: string): void {
		if (id === undefined) {
			return;
		}

		this.FindOrCreatePersonData(id).Load();
	}

	public FindOrCreatePersonData(id: string): PersonData {
		return this.PersonDataById[id] ?? (this.PersonDataById[id] = new PersonData(id));
	}

	public PersonDataById: Record<string, PersonData>;

	static get Instance(): PersonService {
		return this._instance ?? (this._instance = new PersonService());
	}

	private static _instance: PersonService;
}

export const Person: React.FC = () => {
	const routeParams = useParams<{ personId: string }>();
	const background = useBackgroundStyles();

	if (!routeParams.personId) {
		return <PageWithNavigation icon="Person"><NotFound /></PageWithNavigation>;
	}

	const personData = PersonService.Instance.FindOrCreatePersonData(routeParams.personId);
	React.useEffect(() => personData.Load(), [routeParams.personId])

	return (
		<PageWithNavigation icon="Person">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.personId).Item, personData.CreditedItems, LoginService.Instance.User]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon size={48} />}
				whenNotStarted={<LoadingIcon size={48} />}
				whenReceived={(person, creditedItems, user) => (
					<Layout direction="row" gap="1em" py="1em" height="100%">
						<PageTitle text={person.Name} />
						<Layout direction="column" maxWidth="20%" gap={8}>
							<ItemImage item={person} type="Primary" />

							<ItemExternalLinks
								item={person}
								direction="row" gap={8}
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center", grow: 1 }}
							/>
						</Layout>

						<Layout direction="column" grow gap="2em">
							<Layout direction="row" justifyContent="space-between">
								<Layout direction="row" fontSize="2em" className="person-name">{person.Name}</Layout>
								<ItemActionsMenu user={user} actions={[[
									AddToFavoritesAction,
								]]} />
							</Layout>

							<ItemOverview item={person} />
							<PersonAgeBirthAndDeath person={person} />

							<Virtuoso
								data={creditedItems}
								totalCount={creditedItems.length}
								itemContent={(_, item) => <CreditedItem creditedItem={item} />}
								style={{ height: "100%", width: "100%" }}
							/>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

const CreditedItem: React.FC<{ creditedItem: BaseItemDto }> = ({ creditedItem }) => {
	const creditedNameFuncForType = BaseItemKindServiceFactory.FindOrNull(creditedItem.Type)?.personCreditName ?? ((i) => i.Name);

	return (
		<LinkToItem direction="row" item={creditedItem} py=".5em">
			<Layout direction="column" grow>
				<Layout direction="row">{creditedNameFuncForType(creditedItem)}</Layout>
				<Layout direction="row">Role/Part/Credit</Layout>
			</Layout>

			<Layout direction="column" width="5%" px="1em" alignItems="end" justifyContent="center">{creditedItem.ProductionYear}</Layout>
		</LinkToItem>
	);
};

const PersonAgeBirthAndDeath: React.FC<{ person: BaseItemDto }> = (props) => {
	if (!props.person.PremiereDate) {
		return <></>;
	}

	const birthday = parseISO(props.person.PremiereDate);
	const deathOrNow = !props.person.EndDate ? new Date(Date.now()) : parseISO(props.person.EndDate);
	const ageAtDeathOrNow = intervalToDuration({ start: birthday, end: deathOrNow });

	return (
		<>
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
				<Layout direction="row" my={1} className="deathDateAndDeathAge">
					<TranslatedText textKey="DeathDateValue" textProps={[deathOrNow.toLocaleDateString()]} />
					<TranslatedText textKey="AgeValue" textProps={[ageAtDeathOrNow.years?.toString() ?? ""]} />
				</Layout>
			)}
		</>
	);
};
