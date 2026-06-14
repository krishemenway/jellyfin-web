import * as React from "react";
import { MultiSelectEditor } from "Common/SelectFieldEditor";
import { Layout } from "Common/Layout";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { Linq } from "Common/MissingJavascriptFunctions";
import { SortByString } from "Common/Sort";
import { EditableField, IEditableField } from "Common/EditableField";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Computed } from "@residualeffect/reactor";
import { ToggleSwitch } from "Common/ToggleSwitch";
import { CircleSlashIcon } from "CommonIcons/CircleSlashIcon";
import { CircleCheckmarkIcon } from "CommonIcons/CircleCheckmarkIcon";
import { TranslatedText } from "Common/TranslatedText";

export const FilterByGenre: ItemFilterType = {
	FilterType: "FilterByGenre",
	Label: "Genres",
	CreateModel: (data) => new FilterByGenreModel(data as FilterByGenreData),
};

export interface FilterByGenreData {
	Type: "FilterByGenre";
	ContainsGenres: string[];
	Inverse: boolean;
}

export class FilterByGenreModel implements IFilterModel {
	constructor(data?: FilterByGenreData) {
		this.ContainsGenres = new EditableField<string[]>("ContainsGenres", data?.ContainsGenres ?? []);
		this.Inverse = new EditableField<boolean>("Inverse", data?.Inverse ?? false);

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [this.ContainsGenres, this.Inverse]);
	}

	public CreateRequest(): FilterByGenreData {
		return {
			Type: "FilterByGenre",
			ContainsGenres: this.ContainsGenres.Current.Value,
			Inverse: this.Inverse.Current.Value,
		};
	}

	public Editor(items: BaseItemDto[]): React.ReactNode {
		return <GenreEditor genreField={this.ContainsGenres} inverseField={this.Inverse} items={items} />
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const genres = this.ContainsGenres.Current.Value;
		const inverse = this.Inverse.Current.Value;

		return genres.some((t) => item.Genres?.includes(t)) !== inverse;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		return {
			Field: { Key: FilterByGenre.Label },
			Operation: { Key: this.Inverse.Current.Value ? "NotContainFilterDisplay" : "ContainsFilterDisplay", KeyProps: [this.ContainsGenres.Current.Value.join(",")] },
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByGenre;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	private ContainsGenres: EditableField<string[]>;
	private Inverse: EditableField<boolean>;
}

const GenreEditor: React.FC<{ genreField: EditableField<string[]>; inverseField: EditableField<boolean>; items: BaseItemDto[]; }> = ({ genreField, inverseField, items }) => {
	const genres = React.useMemo(() => Linq.Distinct(Linq.SelectMany(items, (i) => i.Genres ?? [])).sort(SortByString(g => g)), [items]);

	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByGenre.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" justifyContent="stretch" gap=".5rem">
				<ToggleSwitch field={inverseField} enabledIcon={<CircleSlashIcon />} disabledIcon={<CircleCheckmarkIcon />} alignItems="center" justifyContent="center" px=".5em" />
				<MultiSelectEditor field={genreField} allOptions={genres} getValue={(genre) => genre} getLabel={(genre) => genre} />
			</Layout>
		</>
	);
};
