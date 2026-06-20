import * as React from "react";
import { FilterDisplayConfig, IFilterModel, ItemFilterType } from "ItemList/ItemFilterType";
import { EditableField, IEditableField } from "Common/EditableField";
import { Computed } from "@residualeffect/reactor";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Layout } from "Common/Layout";
import { NumberField } from "Common/TextField";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText, TranslationRequest } from "Common/TranslatedText";

export const FilterByDuration: ItemFilterType = {
	FilterType: "FilterByDuration",
	Label: "LabelDuration",
	CreateModel: (data) => new FilterByDurationModel(data as FilterByDurationData),
};

export interface FilterByDurationData {
	Type: "FilterByDuration";
	GreaterThanTicks: number|undefined;
	LessThanTicks: number|undefined;
}

export class FilterByDurationModel implements IFilterModel {
	constructor(data?: FilterByDurationData) {
		const [lessThanHours, lessThanMinutes, lessThanSeconds] = Nullable.Value(data?.LessThanTicks, [], (ticks) => DateTime.ConvertTicksToDurationString(ticks).split(":").map(s => parseInt(s, 10)));
		this.LessThanSeconds = new EditableField<number|undefined>("LessThanSeconds", lessThanSeconds);
		this.LessThanMinutes = new EditableField<number|undefined>("LessThanMinutes", lessThanMinutes);
		this.LessThanHours = new EditableField<number|undefined>("LessThanHours", lessThanHours);

		const [greaterThanHours, greaterThanMinutes, greaterThanSeconds] = Nullable.Value(data?.GreaterThanTicks, [], (ticks) => DateTime.ConvertTicksToDurationString(ticks).split(":").map(s => parseInt(s, 10)));
		this.GreaterThanSeconds = new EditableField<number|undefined>("GreaterThanSeconds", greaterThanSeconds);
		this.GreaterThanMinutes = new EditableField<number|undefined>("GreaterThanMinutes", greaterThanMinutes);
		this.GreaterThanHours = new EditableField<number|undefined>("GreaterThanHours", greaterThanHours);

		this.LessThanTicks = new Computed(() => DateTime.ToTicks(this.LessThanSeconds.Current.Value, this.LessThanMinutes.Current.Value, this.LessThanHours.Current.Value));
		this.GreaterThanTicks = new Computed(() => DateTime.ToTicks(this.GreaterThanSeconds.Current.Value, this.GreaterThanMinutes.Current.Value, this.GreaterThanHours.Current.Value));

		this.Display = new Computed(() => this.DisplayConfig());
		this.Filter = new Computed(() => (item: BaseItemDto) => this.FilterFunc(item));
		this.AllFields = new Computed(() => [
			this.LessThanHours,
			this.LessThanMinutes,
			this.LessThanSeconds,
			this.GreaterThanHours,
			this.GreaterThanMinutes,
			this.GreaterThanSeconds,
		]);
	}

	public CreateRequest(): FilterByDurationData {
		return {
			Type: "FilterByDuration",
			GreaterThanTicks: this.GreaterThanTicks.Value,
			LessThanTicks: this.LessThanTicks.Value,
		};
	}

	public Editor(): React.ReactNode {
		return <FilterByDurationEditor model={this} />;
	}

	private FilterFunc(item: BaseItemDto): boolean {
		const greaterThanValue = this.GreaterThanTicks.Value;
		const lessThanValue = this.LessThanTicks.Value;

		if (!Nullable.HasValue(item.RunTimeTicks)) {
			return false;
		}

		if (Nullable.HasValue(greaterThanValue) && item.RunTimeTicks < greaterThanValue) {
			return false;
		}

		if (Nullable.HasValue(lessThanValue) && item.RunTimeTicks > lessThanValue) {
			return false;
		}

		return true;
	}

	private DisplayConfig(): FilterDisplayConfig|undefined {
		const greaterThan = Nullable.Value(this.GreaterThanTicks.Value, undefined, g => DateTime.ConvertTicksToDurationString(g));
		const lessThan = Nullable.Value(this.LessThanTicks.Value, undefined, l => DateTime.ConvertTicksToDurationString(l));

		if (Nullable.HasValue(greaterThan) && Nullable.HasValue(lessThan)) {
			return this.CreateFilterDisplayConfig({ Key: "IsBetweenFilterDisplay", KeyProps: [greaterThan.toString(), lessThan.toString()] });
		} else if (Nullable.HasValue(greaterThan)) {
			return this.CreateFilterDisplayConfig({ Key: "GreaterThanFilterDisplay", KeyProps: [greaterThan.toString()] });
		} else if (Nullable.HasValue(lessThan)) {
			return this.CreateFilterDisplayConfig({ Key: "LessThanFilterDisplay", KeyProps: [lessThan.toString()] });
		}

		return undefined;
	}

	private CreateFilterDisplayConfig(operation: TranslationRequest): FilterDisplayConfig {
		return {
			Field: { Key: FilterByDuration.Label },
			Operation: operation,
		};
	}

	public Key: string = self.crypto.randomUUID().toString();
	public FilterType = FilterByDuration;
	public Display: Computed<FilterDisplayConfig|undefined>;
	public Filter: Computed<(item: BaseItemDto) => boolean>;
	public AllFields: Computed<IEditableField[]>;

	public LessThanSeconds: EditableField<number|undefined>;
	public LessThanMinutes: EditableField<number|undefined>;
	public LessThanHours: EditableField<number|undefined>;

	public GreaterThanSeconds: EditableField<number|undefined>;
	public GreaterThanMinutes: EditableField<number|undefined>;
	public GreaterThanHours: EditableField<number|undefined>;

	private LessThanTicks: Computed<number|undefined>;
	private GreaterThanTicks: Computed<number|undefined>;
}

const FilterByDurationEditor: React.FC<{ model: FilterByDurationModel }> = ({ model }) => {
	return (
		<>
			<Layout direction="row" gap="1em">
				<TranslatedText textKey={FilterByDuration.Label} elementType="div" layout={{ fontSizeREM: 1.2 }} />
			</Layout>

			<Layout direction="row" gap=".5rem">
				<Layout direction="row" px=".5em" py=".5em">&gt;</Layout>
				<Layout direction="row" alignItems="center">
					<NumberField field={model.GreaterThanHours} width="3rem" placeholder={{ Key: "LabelDurationHours" }} px=".25em" py=".25em" />
					<Layout direction="row" px=".5rem">:</Layout>
					<NumberField field={model.GreaterThanMinutes} width="3rem" placeholder={{ Key: "LabelDurationMinutes" }} px=".25em" py=".25em" />
					<Layout direction="row" px=".5rem">:</Layout>
					<NumberField field={model.GreaterThanSeconds} width="3rem" placeholder={{ Key: "LabelDurationSeconds" }} px=".25em" py=".25em" />
				</Layout>
			</Layout>

			<Layout direction="row" gap=".5rem">
				<Layout direction="row" px=".5em" py=".5em">&lt;</Layout>
				<Layout direction="row" alignItems="center">
					<NumberField field={model.LessThanHours} width="3rem" placeholder={{ Key: "LabelDurationHours" }} px=".25em" py=".25em" />
					<Layout direction="row" px=".5rem">:</Layout>
					<NumberField field={model.LessThanMinutes} width="3rem" placeholder={{ Key: "LabelDurationMinutes" }} px=".25em" py=".25em" />
					<Layout direction="row" px=".5rem">:</Layout>
					<NumberField field={model.LessThanSeconds} width="3rem" placeholder={{ Key: "LabelDurationSeconds" }} px=".25em" py=".25em" />
				</Layout>
			</Layout>
		</>
	);
};
