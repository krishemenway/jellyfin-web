import * as React from "react";
import { parseISO, intervalToDuration } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import Layout from "Common/Layout";
import NavigationBar from "NavigationBar/NavigationBar";
import { Loading } from "Common/Loading";
import { Receiver } from "Common/Receiver";
import NotFound from "Common/NotFound";
import { ServerService } from "Servers/ServerService";
import LoadingSpinner from "Common/LoadingSpinner";
import LoadingErrorMessages from "Common/LoadingErrorMessages";
import TranslatedText from "Common/TranslatedText";
import ListOf from "Common/ListOf";
import ItemImage from "Items/ItemImage";

class PersonData {
	constructor(id: string) {
		this.Id = id;
		this.BaseDTO = new Receiver("UnknownError");
		this.RelatedItems = new Receiver("UnknownError");
	}

	public Load(): void {
		this.BaseDTO.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ userId: ServerService.Instance.CurrentUserId, ids: [this.Id] }, { signal: a.signal }).then((response) => {
			if (!response.data.Items) {
				throw new Error("Missing id");
			}

			return response.data.Items[0];
		}));

		this.RelatedItems.Start((a) => getItemsApi(ServerService.Instance.CurrentApi).getItems({ limit: 100, enableUserData: true, imageTypeLimit: 1, enableTotalRecordCount: true, fields: ["MediaSourceCount"], personIds: [this.Id], recursive: true, userId: ServerService.Instance.CurrentUserId, includeItemTypes: [ "Audio", "Movie", "Episode", "AudioBook", "Photo", "Video"] }, { signal: a.signal }).then((response) => {
			return response.data.Items?.sort((a, b) => (b.ProductionYear ?? 10000) - (a.ProductionYear ?? 10000)) ?? [];
		}));
	}

	public Id: string;
	public BaseDTO: Receiver<BaseItemDto>;
	public RelatedItems: Receiver<BaseItemDto[]>;
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

const Person: React.FC = () => {
	const routeParams = useParams<{ personId: string }>();

	if (!routeParams.personId) {
		return <NotFound />;
	}

	const personData = PersonService.Instance.FindOrCreatePersonData(routeParams.personId);
	React.useEffect(() => { personData.Load(); }, [routeParams.personId])

	return (
		<Layout direction="column" py={16} gap={16}>
			<NavigationBar />

			<Loading
				receivers={[personData.BaseDTO, personData.RelatedItems]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingSpinner />}
				whenNotStarted={<LoadingSpinner />}
				whenReceived={(personDto, relatedItems) => (
					<Layout direction="column">
						<Layout direction="row" maxWidth={200}><ItemImage item={personDto} type="Primary" /></Layout>
						<Layout direction="row">{personDto.Name}</Layout>
						<Layout direction="row">{personDto.Overview}</Layout>
						<PersonAgeBirthAndDeath person={personDto} />
						<ExternalUrls person={personDto}  />
						<RelatedItems items={relatedItems} />
					</Layout>
				)}
			/>
		</Layout>
	);
};

const PersonAgeBirthAndDeath: React.FC<{ person: BaseItemDto }> = (props) => {
	if (!props.person.PremiereDate) {
		return <></>;
	}

	const birthday = parseISO(props.person.PremiereDate);
	const deathOrNow = !!props.person.EndDate ? parseISO(props.person.EndDate) : new Date(Date.now());
	const ageAtDeathOrNow = intervalToDuration({ start: birthday, end: deathOrNow });

	return (
		<>
			<Layout direction="row" alignItems="center" gap={8} mx={8}>
				<Layout direction="row" className="birthDate"><TranslatedText textKey="BirthDateValue" textProps={[birthday.toLocaleDateString()]} /></Layout>

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

const ExternalUrls: React.FC<{ person: BaseItemDto }> = (props) => {
	if (!props.person.ExternalUrls || props.person.ExternalUrls.length === 0) {
		return <></>;
	}

	return (
		<Layout direction="row" gap={8}>
			{props.person.ExternalUrls.map((e) => <Link to={e.Url ?? ""}>{e.Name}</Link>)}
		</Layout>
	);
};

const RelatedItems: React.FC<{ items: BaseItemDto[] }> = (props) => {
	return (
		<ListOf
			listLayout={{ direction: "column" }}
			listItemLayout={{ direction: "row" }}
			items={props.items}
			createKey={(item, i) => item.Id ?? i.toString()}
			renderItem={(item) => (
				<>
					<Layout direction="row">{item.Name}</Layout>
					<Layout direction="row">{item.ProductionYear}</Layout>
				</>
			)}
		/>
	);
};

export default Person;
