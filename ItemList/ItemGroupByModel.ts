import { ItemViewOptionGroupByData } from "ItemList/ItemListViewOptions";
import { ItemGroupByTypeStore } from "ItemList/ItemGroupByTypeStore";
import { ItemGroupByType } from "ItemList/ItemGroupByType";
import { EditableField } from "Common/EditableField";
import { Nullable } from "Common/MissingJavascriptFunctions";

export class ItemGroupByModel {
	constructor(type: string, data?: ItemViewOptionGroupByData) {
		this.GroupByType = ItemGroupByTypeStore.Instance.FindOrThrow(type);
		this.IsNew = new EditableField("IsNew", false);
		this.SortGroups = new EditableField("GroupBySortType", data?.GroupBySortType ?? "Name");
		this.IsNew.OnChange(!Nullable.HasValue(data))
	}

	public CreateRequest(): ItemViewOptionGroupByData {
		return {
			GroupByType: this.GroupByType.GroupByType,
			GroupBySortType: this.SortGroups.Current.Value,
		};
	}

	public GroupByType: ItemGroupByType;
	public IsNew: EditableField<boolean>;
	public SortGroups: EditableField<string>;
}
