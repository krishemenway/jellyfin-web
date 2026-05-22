import * as React from "react";
import { BaseItemDto, BaseItemPerson, PersonKind } from "@jellyfin/sdk/lib/generated-client/models";
import { useBreakpointValues } from "AppStyles";
import { SortByNumber, SortByObjects } from "Common/Sort";
import { ListOf } from "Common/ListOf";
import { LinkToPerson } from "People/LinkToPerson";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { Linq, Nullable } from "Common/MissingJavascriptFunctions";
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
import { ItemEditorService } from "Items/ItemEditorService";
import { BaseItemKindServiceFactory } from "Items/BaseItemKindServiceFactory";

export const CastAndCrew: React.FC<{ itemWithPeople: BaseItemDto; className?: string; linkProps?: StyleLayoutProps; }&EditableItemProps&StyleLayoutProps> = (props) => {
	const relevantPersonKinds = BaseItemKindServiceFactory.FindOrThrow(props.itemWithPeople.Type).relevantPersonKinds ?? [];
	const orderedCastAndCrew = React.useMemo(() => SortByObjects(props.itemWithPeople.People ?? [], [
		{ LabelKey: "", Reversed: false, SortType: "PriorityOrder", Sort: SortByNumber((p) => sortPriorityByType[p.Type ?? "Unknown"]), GetContent: () => "", Hidden: true },
	]), [props.itemWithPeople.People]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <EditableCastAndCrew {...props} editableItem={props.editableItem} relevantPersonKinds={relevantPersonKinds} />;
	}

	return (
		<ListOf
			direction="row"
			items={orderedCastAndCrew}
			emptyListView={Nullable.HasValue(props.editableItem) ? <Button type="button" onClick={() => { ItemEditorService.Instance.IsEditing.Value = true; props.editableItem!.People.push(new EditablePersonCredit({ Type: relevantPersonKinds[0] })); }} icon={<AddIcon />} px=".5em" alignItems="center" label="Add" /> : <Layout direction="row"><TranslatedText textKey="MessageNothingHere" /></Layout>}
			forEachItem={((person) => <CastAndCrewCredit key={person.Id + Linq.Coalesce([person.Role, person.Type?.toString()], "Unknown", (s) => Nullable.StringHasValue(s))} person={person} {...props.linkProps} />)}
			{...props}
		/>
	);
};

const EditableCastAndCrew: React.FC<{ className?: string; editableItem: EditableItem; relevantPersonKinds: PersonKind[] }&StyleLayoutProps> = (props) => {
	const itemsPerRow = useBreakpointValues(1, 2, 3, 5);
	const people = useObservable(props.editableItem.People);

	return (
		<Layout direction="row" wrap gap=".25rem">
			{people.map((person) => (
				<EditPersonCredit key={person.Key} person={person} onDelete={() => { props.editableItem.People.remove(person); }} itemsPerRow={itemsPerRow} relevantPersonKinds={props.relevantPersonKinds} />
			))}

			<Button
				type="button"
				onClick={() => { props.editableItem.People.push(new EditablePersonCredit({ Type: props.relevantPersonKinds[0]  }))}}
				icon={<AddIcon />}
				width={{ itemsPerRow: itemsPerRow, gap: ".25rem" }}
				px=".5em" gap=".5rem" alignItems="center" justifyContent="center"
			/>
		</Layout>
	);
};

const EditPersonCredit: React.FC<{ person: EditablePersonCredit; onDelete: () => void; relevantPersonKinds: PersonKind[]; itemsPerRow: number; }&StyleLayoutProps> = (props) => {
	return (
		<Layout direction="column" width={{ itemsPerRow: props.itemsPerRow, gap: ".25rem" }} gap=".25rem">
			<Layout direction="row" gap=".25rem">
				<TextField field={props.person.Name} width="100%" minWidth="50px" px=".25em" />
				<Button type="button" onClick={props.onDelete} icon={<DeleteIcon />} px=".25em" py=".25em" />
			</Layout>

			<Layout direction="row" gap=".25rem">
				<SelectFieldEditor
					allOptions={props.relevantPersonKinds}
					field={props.person.Type}
					getValue={(k) => k}
					getLabel={(p) => p.toString()}
				/>

				<Layout direction="row" grow><TextField field={props.person.Role} width="100%" /></Layout>
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
