import * as React from "react";
import { ContainOperation, NotContainOperation } from "ItemList/FilterOperations/ContainOperation";
import { ItemFilterType, ItemFilterTypeProps } from "ItemList/ItemFilterType";
import { Layout } from "Common/Layout";
import { AutoCompleteFieldEditor } from "Common/SelectFieldEditor";
import { EmptyOperation, NotEmptyOperation } from "ItemList/FilterOperations/EmptyOperation";
import { ItemService } from "Items/ItemsService";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";
import { Loading } from "Common/Loading";

const StudioEditor: React.FC<ItemFilterTypeProps> = (props) => {
	const studioList = ItemService.Instance.FindOrCreateItemList(props.libraryId, "Studio");

	if (props.currentOperation === EmptyOperation || props.currentOperation === NotEmptyOperation) {
		return <></>;
	}

	React.useEffect(() => studioList.LoadWithAbort(), [studioList]);

	return (
		<Layout direction="column">
			<Loading
				receivers={[studioList.List]}
				whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
				whenLoading={<LoadingIcon alignSelf="center" size="2em" />}
				whenNotStarted={<LoadingIcon alignSelf="center" size="2em" />}
				whenReceived={(items) => (
					<AutoCompleteFieldEditor field={props.filter.FilterValue} allOptions={items.List.map((s) => s.Name ?? "")} getKey={(studioName) => studioName} getLabel={(studioName) => studioName} />
				)}
			/>
		</Layout>
	);
};

export const FilterByStudio: ItemFilterType = {
	type: "FilterByStudio",
	labelKey: "Studios",
	editor: StudioEditor,
	targetField: (item) => item.Studios?.map(s => s.Name ?? ""),
	operations: [
		ContainOperation,
		NotContainOperation,
		EmptyOperation,
		NotEmptyOperation,
	],
};
