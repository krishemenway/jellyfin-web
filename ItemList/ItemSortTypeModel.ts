import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { Computed } from "@residualeffect/reactor";
import { ReverseSort, SortFunc } from "Common/ArrayPrototype";
import { EditableField, IEditableField } from "Common/EditableField";
import { ItemViewOptionSortData } from "ItemList/ItemListViewOptions";
import { ItemSortType } from "ItemList/ItemSortType";

export class ItemSortTypeModel {
	constructor(sortType: ItemSortType, data?: ItemViewOptionSortData) {
		this.Key = self.crypto.randomUUID();
		this.SortType = sortType;
		this.Reversed = new EditableField("Reversed", data?.Reversed ?? false);
		this.ContentHidden = new EditableField("ContentHidden", data?.Hidden ?? false);
		this.SortFunc = new Computed(() => this.Reversed.Current.Value ? ReverseSort(this.SortType.sortFunc) : this.SortType.sortFunc);

		this.AllFields = new Computed(() => [
			this.Reversed,
			this.ContentHidden,
		]);
	}

	public CreateRequest(): ItemViewOptionSortData {
		return {
			SortType: this.SortType.field,
			Reversed: this.Reversed.Current.Value,
			Hidden: this.ContentHidden.Current.Value,
		};
	}

	public Key: string;
	public AllFields: Computed<IEditableField[]>;
	public SortFunc: Computed<SortFunc<BaseItemDto>>;
	public SortType: ItemSortType;
	public Reversed: EditableField<boolean>;
	public ContentHidden: EditableField<boolean>;
}
