import * as React from "react";
import { BaseItemDto, BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { ResponsiveBreakpoint, useBreakpointValue } from "AppStyles";
import { SortByNumber, SortByObjects } from "Common/Sort";
import { ListOf } from "Common/ListOf";
import { LinkToPerson } from "People/LinkToPerson";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";

export const CastAndCrew: React.FC<{ itemWithPeople: BaseItemDto; className?: string; linkProps?: StyleLayoutProps }&StyleLayoutProps> = (props) => {
	const orderedCastAndCrew = React.useMemo(() => SortByObjects(props.itemWithPeople.People ?? [], [
		{ LabelKey: "", Reversed: false, SortType: "PriorityOrder", Sort: SortByNumber((p) => sortPriorityByType[p.Type ?? "Unknown"]) },
	]), [props.itemWithPeople.People]);

	return (
		<ListOf
			direction="row"
			items={orderedCastAndCrew}
			forEachItem={((person) => <CastAndCrewCredit key={"" + person.Id + (person.Role ?? person.Type)} person={person} {...props.linkProps} />)}
			{...props}
		/>
	);
};

const CastAndCrewCredit: React.FC<{ person: BaseItemPerson; }&StyleLayoutProps> = (props) => {
	const itemsPerRow = useBreakpointValue({ [ResponsiveBreakpoint.Mobile]: 1, [ResponsiveBreakpoint.Tablet]: 3, [ResponsiveBreakpoint.Desktop]: 6 });

	return (
		<LinkToPerson id={props.person.Id} direction="column" width={{ itemsPerRow: itemsPerRow }} {...props}>
			<Layout direction="row" fontSize="1em">{props.person.Name}</Layout>
			<Layout direction="row" fontSize=".8em">
				{Nullable.HasValue(props.person.Role) ? props.person.Role : <TranslatedText textKey={props.person.Type!} />}
			</Layout>
		</LinkToPerson>
	);
};

const sortPriorityByType: Record<PersonKind, number> = {
	"Director": 0,
	"Creator": 0,
	"Writer": 1,
	"Actor": 2,
	"Editor": 3,
	"Producer": 4,
	"GuestStar": 5,
	"Composer": 50,
	"Conductor": 50,
	"Lyricist": 50,
	"Arranger": 50,
	"Engineer": 50,
	"Mixer": 50,
	"Remixer": 50,
	"Artist": 50,
	"AlbumArtist": 50,
	"Author": 50,
	"Illustrator": 50,
	"Penciller": 50,
	"Inker": 50,
	"Colorist": 50,
	"Letterer": 50,
	"CoverArtist": 50,
	"Translator": 50,
	"Unknown": 100,
};
