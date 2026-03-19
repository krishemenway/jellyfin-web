import * as React from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Layout } from "Common/Layout"
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions"

export const ItemDuration: React.FC<{ item: BaseItemDto; }> = (props) => {
	return <Duration runtime={props.item.RunTimeTicks} />
};

export const AggregateItemDuration: React.FC<{ items: BaseItemDto[] }> = (props) => {
	const total = React.useMemo(() => props.items.reduce((total, current) => { total += current.RunTimeTicks ?? 0; return total; }, 0), [props.items]);
	return <Duration runtime={total} />
}

const Duration: React.FC<{ runtime: number|undefined|null }> = (props) => {
	const duration = React.useMemo(() => DateTime.ConvertTicksToDurationString(props.runtime), [props.runtime]);

	return Nullable.StringHasValue(duration)
		? <Layout direction="row" className="item-runtime" children={duration} />
		: <></>;
}
