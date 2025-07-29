import * as React from "react";
import { PageWithNavigation } from "NavigationBar/PageWithNavigation";
import { useParams } from "react-router-dom";
import { NotFound } from "Common/NotFound";
import { ItemService } from "Items/ItemsService";
import { Loading } from "Common/Loading";
import { LoadingIcon } from "Common/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Layout } from "Common/Layout";
import { ItemImage } from "Items/ItemImage";
import { ItemRating } from "Items/ItemRating";
import { ItemStudios } from "Items/ItemStudios";
import { ItemExternalLinks } from "Items/ItemExternalLinks";
import { ItemGenres } from "Items/ItemGenres";
import { useBackgroundStyles } from "Common/AppStyles";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ItemActionsMenu } from "Items/ItemActionsMenu";
import { ItemOverview } from "Items/ItemOverview";
import { BaseItemDto, BaseItemPerson } from "@jellyfin/sdk/lib/generated-client/models";
import { TranslatedText } from "Common/TranslatedText";
import { ListOf } from "Common/ListOf";
import { LinkToPerson } from "People/LinkToPerson";
import { LoginService } from "Users/LoginService";

export const Movie: React.FC = () => {
	const routeParams = useParams<{ movieId: string }>();
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(routeParams.movieId)) {
		return <PageWithNavigation itemKind="Movie"><NotFound /></PageWithNavigation>;
	}

	React.useEffect(() => ItemService.Instance.FindOrCreateItemData(routeParams.movieId).LoadItemWithAbort(), [routeParams.movieId]);

	return (
		<PageWithNavigation itemKind="Movie">
			<Loading
				receivers={[ItemService.Instance.FindOrCreateItemData(routeParams.movieId).Item, LoginService.Instance.User]}
				whenNotStarted={<LoadingIcon size={48} />}
				whenLoading={<LoadingIcon size={48} />}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenReceived={(movie, user) => (
					<Layout direction="row" gap={16} py={16}>
						<Layout direction="column" maxWidth="20%" gap={8}>
							<Layout direction="column" gap={8}>
								<Layout direction="column" position="relative">
									<ItemImage item={movie} type="Primary" />
									<ItemRating item={movie} position="absolute" bottom={8} right={8} />
								</Layout>

								<ItemExternalLinks
									item={movie}
									direction="row" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
								/>

								<ItemGenres
									item={movie}
									direction="row" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
								/>

								<ItemStudios
									item={movie}
									direction="column" gap={8}
									linkClassName={background.button}
									linkLayout={{ direction: "column", width: "100%", py: 8, textAlign: "center", alignItems: "center", justifyContent: "center", grow: 1 }}
								/>
							</Layout>
						</Layout>
						<Layout direction="column" grow gap={32}>
							<Layout direction="row" fontSize="2em" justifyContent="space-between">
								<Layout direction="row" className="show-name">{movie.Name}</Layout>
								<ItemActionsMenu actions={[]} user={user} />
							</Layout>
							<ItemOverview item={movie} />
							<CastAndCrew item={movie} />
						</Layout>
					</Layout>
				)}
			/>
		</PageWithNavigation>
	);
};

const CastAndCrew: React.FC<{ item: BaseItemDto }> = (props) => {
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(props.item.People) || props.item.People.length === 0 ) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Layout direction="row" fontSize="1.5em" py={8} px={8} className={background.panel}><TranslatedText textKey="HeaderCastAndCrew" /></Layout>

			<ListOf
				className={background.panel}
				direction="row" wrap gap={16} px={8} py={16}
				items={props.item.People ?? []}
				forEachItem={((person) => <CastAndCrewCredit person={person} />)}
			/>
		</Layout>
	);
};

const CastAndCrewCredit: React.FC<{ person: BaseItemPerson }> = (props) => {
	return (
		<Layout direction="column" width={{ itemsPerRow: 6, gap: 16 }} gap={4}>
			<Layout direction="row" fontSize="1em"><LinkToPerson direction="row" id={props.person.Id}>{props.person.Name}</LinkToPerson></Layout>
			<Layout direction="row" fontSize=".8em">{props.person.Role}</Layout>
		</Layout>
	);
};
