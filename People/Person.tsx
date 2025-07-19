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
import { IconForItemType } from "Items/IconForItemType";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ItemFavoriteIcon } from "Items/ItemFavoriteIcon";
import { useBackgroundStyles } from "Common/AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { LinkToItem } from "Items/LinkToItem";
import { ItemNameWithContext } from "Items/ItemNameWithContext";
import { ItemExternalLinks } from "Items/ItemExternalLinks";

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
			this.Person.AbortWhenLoading();
			this.CreditedItems.AbortWhenLoading();
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
		return <NotFound />;
	}

	const personData = PersonService.Instance.FindOrCreatePersonData(routeParams.personId);
	React.useEffect(() => personData.Load(), [routeParams.personId])

	return (
		<PageWithNavigation icon={<IconForItemType itemType="Person" size={24} />}>
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.personId).Item, personData.CreditedItems]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon size={48} />}
				whenNotStarted={<LoadingIcon size={48} />}
				whenReceived={(person, creditedItems) => (
					<Layout direction="row" gap={16} py={16}>
						<Layout direction="column" maxWidth="20%" gap={8}>
							<ItemImage item={person} type="Primary" />

							<ItemExternalLinks
								item={person}
								linkClassName={background.button}
								linkLayout={{ direction: "row", width: "100%", py: 8, justifyContent: "center"}}
								listLayout={{ direction: "row", gap: 8 }}
								listItemLayout={{ direction: "row", grow: 1 }}
							/>
						</Layout>

						<Layout direction="column" maxWidth="calc(80% - 16px)" gap={32}>
							<Layout direction="row" justifyContent="space-between">
								<Layout direction="row" fontSize="32px" className="person-name">{person.Name}</Layout>
								<ItemActionsMenu actions={[[
									{
										textKey: "AddToFavorites",
										action: () => { console.log("Add To Favorites.") },
										icon: <ItemFavoriteIcon size={24} />,
									},
								]]} />
							</Layout>

							{Nullable.HasValue(person.Overview) ? <Layout direction="row" fontSize="12px" className="person-overview">{person.Overview}</Layout> : <></>}
							<PersonAgeBirthAndDeath person={person} />

							<table style={{ width: "75%" }}>
								<thead><tr><th style={{ width: "15%" }}></th><th></th><th style={{ width: "15%" }}></th></tr></thead>
								<tbody>
								{creditedItems.map((creditedItem, index) => (
									<tr key={creditedItem.Id ?? index.toString()}>
										<td>
											<ItemImage item={creditedItem} type="Primary" maxWidth="100%" />
										</td>
										<td>
											<LinkToItem direction="row" item={creditedItem}><ItemNameWithContext item={creditedItem} /></LinkToItem>
											<Layout direction="row">Role/Part/Credit</Layout>
										</td>
										<td>{creditedItem.ProductionYear}</td>
									</tr>
								))}
								</tbody>
							</table>
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
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
			<Layout direction="row" alignItems="center" gap={8} mx={8}>
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
