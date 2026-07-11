import * as React from "react";
import { BaseItemDto, BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useBreakpointValues } from "AppStyles";
import { ListOf } from "Common/ListOf";
import { LinkToPerson } from "People/LinkToPerson";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";
import { EditableItemProps } from "Items/EditableItemProps";
import { useObservable } from "@residualeffect/rereactor";
import { EditablePersonCredit } from "Items/EditablePersonCredit";
import { EditableItem } from "Items/EditableItem";
import { TextField } from "Common/TextField";
import { SelectFieldEditor } from "Common/SelectFieldEditor";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { Button } from "Common/Button";
import { AddIcon } from "CommonIcons/AddIcon";
import { Collapsible } from "Common/Collapsible";
import { SortByNumber } from "Common/ArrayPrototype";

export const CastAndCrew: React.FC<{ itemWithPeople: BaseItemDto; classes?: string[]; linkProps?: StyleLayoutProps; startOpen?: boolean; relevantPersonKinds?: PersonKind[]; }&EditableItemProps&StyleLayoutProps> = (props) => {
	const [open, setOpen] = React.useState(props.startOpen ?? false);
	const itemsPerRow = useBreakpointValues(1, 2, 3, 5);
	const orderedCastAndCrew = React.useMemo(() => (props.itemWithPeople.People ?? []).sort(SortByNumber((p) => sortPriorityByType[p.Type ?? "Unknown"])), [props.itemWithPeople.People]);

	if (!props.isEditing && orderedCastAndCrew.length === 0) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" label="HeaderCastAndCrew" onClick={() => setOpen(!open)} direction="row" fontSizeREM={1.5} py=".5em" px=".5em" gap=".5em" />

			<Collapsible open={open}>
				{props.isEditing && Nullable.HasValue(props.editableItem) ? (
					<EditableCastAndCrew {...props} editableItem={props.editableItem} relevantPersonKinds={props.relevantPersonKinds ?? []} itemsPerRow={itemsPerRow} />
				) : (
					<ReadOnlyCastAndCrew orderedCastAndCrew={orderedCastAndCrew} {...props} />
				)}
			</Collapsible>
		</Layout>
	);
};

const ReadOnlyCastAndCrew: React.FC<{ orderedCastAndCrew: BaseItemPerson[]; linkProps?: StyleLayoutProps }&StyleLayoutProps> = ({ orderedCastAndCrew, linkProps, ...props }) => {
	return (
		<ListOf
			items={orderedCastAndCrew}
			direction="row" backgroundColor="Panel" bt br bb bl
			forEachItem={((person) => <CastAndCrewCredit key={person.Id + [person.Role, person.Type?.toString()].coalesce("Unknown", Nullable.StringHasValue)} person={person} {...linkProps} />)}
			{...props}
		/>
	);
};

const EditableCastAndCrew: React.FC<{ classes?: string[]; editableItem: EditableItem; relevantPersonKinds: PersonKind[]; itemsPerRow: number; }&StyleLayoutProps> = ({ classes, editableItem, relevantPersonKinds, itemsPerRow, ...props }) => {
	const people = useObservable(editableItem.People);

	return (
		<Layout direction="row" wrap gap=".25rem" classes={classes} {...props}>
			{people.map((person) => (
				<EditPersonCredit key={person.Key} person={person} onDelete={() => { editableItem.People.remove(person); }} itemsPerRow={itemsPerRow} relevantPersonKinds={relevantPersonKinds} />
			))}

			<Button
				type="button"
				onClick={() => { editableItem.People.push(new EditablePersonCredit({ Type: relevantPersonKinds[0]  }))}}
				icon={<AddIcon />}
				width={{ itemsPerRow: itemsPerRow, gap: ".25rem" }}
				px=".5em" py="1.1rem" gap=".5rem" alignItems="center" justifyContent="center"
			/>
		</Layout>
	);
};

const EditPersonCredit: React.FC<{ person: EditablePersonCredit; onDelete: () => void; relevantPersonKinds: PersonKind[]; itemsPerRow: number; }&StyleLayoutProps> = (props) => {
	return (
		<Layout direction="column" width={{ itemsPerRow: props.itemsPerRow, gap: ".25rem" }} gap=".25rem">
			<Layout direction="row" gap=".25rem">
				<TextField field={props.person.Name} width="100%" minWidth="50px" px=".25em" bt br bb bl backgroundColor="Field" />
				<Button type="button" onClick={props.onDelete} icon={<DeleteIcon />} px=".25em" py=".25em" />
			</Layout>

			<Layout direction="row" gap=".25rem">
				<SelectFieldEditor
					allOptions={props.relevantPersonKinds}
					field={props.person.Type}
					getValue={(k) => k}
					getLabel={(p) => p.toString()}
				/>

				<Layout direction="row" grow><TextField field={props.person.Role} width="100%" bt br bb bl backgroundColor="Field" /></Layout>
			</Layout>
		</Layout>
	);
};

const CastAndCrewCredit: React.FC<{ person: BaseItemPerson; }&StyleLayoutProps> = (props) => {
	const itemsPerRow = useBreakpointValues(1, 3, 6, 7);

	return (
		<LinkToPerson id={props.person.Id} direction="column" width={{ itemsPerRow: itemsPerRow }} {...props}>
			<Layout direction="row" fontSizeREM={1}>{props.person.Name}</Layout>
			<Layout direction="row" fontSizeREM={.8}>
				{Nullable.StringValue(props.person.Role, <TranslatedText textKey={props.person.Type!} />, (role) => <>{role}</>)}
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
