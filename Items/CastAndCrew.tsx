import * as React from "react";
import { BaseItemDto, BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { ResponsiveBreakpoint, useBreakpointValue } from "AppStyles";
import { SortByNumber, SortByObjects } from "Common/Sort";
import { ListOf } from "Common/ListOf";
import { LinkToPerson } from "People/LinkToPerson";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";
import { EditableItemProps } from "Items/EditableItemProps";
import { useObservable } from "@residualeffect/rereactor";
import { EditablePersonCredit } from "Items/EditablePersonCredit";
import { EditableItem } from "./EditableItem";
import { TextField } from "Common/TextField";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { Button } from "Common/Button";
import { AddIcon } from "CommonIcons/AddIcon";

export const CastAndCrew: React.FC<{ itemWithPeople: BaseItemDto; className?: string; linkProps?: StyleLayoutProps; }&EditableItemProps&StyleLayoutProps> = (props) => {
	const orderedCastAndCrew = React.useMemo(() => SortByObjects(props.itemWithPeople.People ?? [], [
		{ LabelKey: "", Reversed: false, SortType: "PriorityOrder", Sort: SortByNumber((p) => sortPriorityByType[p.Type ?? "Unknown"]) },
	]), [props.itemWithPeople.People]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <EditableCastAndCrew {...props} editableItem={props.editableItem} />;
	}

	return (
		<ListOf
			direction="row"
			items={orderedCastAndCrew}
			forEachItem={((person) => <CastAndCrewCredit key={person.Id + Linq.Coalesce([person.Role, person.Type?.toString()], "Unknown", (s) => Nullable.StringHasValue(s))} person={person} {...props.linkProps} />)}
			{...props}
		/>
	);
};

const EditableCastAndCrew: React.FC<{ className?: string; editableItem: EditableItem }&StyleLayoutProps> = (props) => {
	const people = useObservable(props.editableItem.People);

	return (
		<ListOf
			direction="row"
			items={people}
			forEachItem={((person) => <EditPersonCredit key={person.Key} person={person} onDelete={() => { props.editableItem.People.remove(person); }} />)}
			afterItems={(
				<Button
					type="button"
					onClick={() => { props.editableItem.People.push(new EditablePersonCredit(undefined))}}
					icon={<AddIcon />}
					label={{ Key: "HeaderCastAndCrew" }}
					px=".5em" gap=".5rem" alignItems="center"
				/>
			)}
			{...props}
		/>
	);
}

const EditPersonCredit: React.FC<{ person: EditablePersonCredit; onDelete: () => void; }&StyleLayoutProps> = (props) => {
	const itemsPerRow = useBreakpointValue({ [ResponsiveBreakpoint.Mobile]: 1, [ResponsiveBreakpoint.Tablet]: 2, [ResponsiveBreakpoint.Desktop]: 5, [ResponsiveBreakpoint.Wide]: 5 });
	const selectedType = useObservable(props.person.Type.Current);

	return (
		<Layout direction="row" width={{ itemsPerRow: itemsPerRow }} justifyContent="space-between" px=".5rem" py=".5rem" gap=".5rem">
			<Layout direction="column" grow>
				<TextField field={props.person.Name} />
				<Layout direction="row" grow>
					<SelectFieldEditor
						allOptions={[PersonKind.Actor, PersonKind.Director, PersonKind.Writer, PersonKind.GuestStar, PersonKind.Producer]}
						field={props.person.Type}
						getValue={(k) => k}
						getLabel={(p) => p.toString()}
					/>

					{(selectedType === "Actor" || selectedType === "GuestStar") && (
						<TextField field={props.person.Role} grow />
					)}
				</Layout>
			</Layout>
			<Layout direction="column">
				<Button type="button" icon={<DeleteIcon />} onClick={() => { props.onDelete(); }} px=".75em" py=".75em" />
			</Layout>
		</Layout>
	);
};

const CastAndCrewCredit: React.FC<{ person: BaseItemPerson; }&StyleLayoutProps> = (props) => {
	const itemsPerRow = useBreakpointValue({ [ResponsiveBreakpoint.Mobile]: 1, [ResponsiveBreakpoint.Tablet]: 3, [ResponsiveBreakpoint.Desktop]: 6, [ResponsiveBreakpoint.Wide]: 7 });

	return (
		<LinkToPerson id={props.person.Id} direction="column" width={{ itemsPerRow: itemsPerRow }} {...props}>
			<Layout direction="row" fontSize="1em">{props.person.Name}</Layout>
			<Layout direction="row" fontSize=".8em">
				{Nullable.StringHasValue(props.person.Role) ? props.person.Role : <TranslatedText textKey={props.person.Type!} />}
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
