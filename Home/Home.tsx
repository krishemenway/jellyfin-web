import * as React from "react";
import PageWithNavigation from "NavigationBar/PageWithNavigation";
import ListOf from "Common/ListOf";
import { useObservable } from "@residualeffect/rereactor";
import ItemsRow from "Items/ItemsRow";
import { HomeService } from "Home/HomeService";
import { ItemFilter } from "Items/ItemFilter";
import HomeIcon from "Home/HomeIcon";

const Home: React.FC = () => {
	const configuredItemFilters = useObservable(HomeService.Instance.ConfiguredItemFilters);

	return (
		<PageWithNavigation icon={<HomeIcon size={24} />}>
			<ListOf
				listLayout={{ direction: "column", gap: 16 }}
				items={configuredItemFilters}
				createKey={(s) => s.Id}
				renderItem={(filter) => <HomeItemRow filter={filter} />}
			/>
		</PageWithNavigation>
	);
};

const HomeItemRow: React.FC<{ filter: ItemFilter }> = (props) => {
	const items = useObservable(props.filter.Items);

	return (
		<>
			<h3>{props.filter.Label}</h3>
			<ItemsRow items={items} />
		</>
	);
};

export default Home;
