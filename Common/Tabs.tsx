import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { EditableField } from "Common/EditableField";
import Button from "Common/Button";
import Layout from "Common/Layout";

interface TabDefinition {
	id: string;
	label: string;
	content: () => JSX.Element;
}

interface TabsProps {
	className?: string;
	field: EditableField;
	tabs: TabDefinition[];
}

export const Tabs: React.FC<TabsProps> = (props) => {
	const value = useObservable(props.field.Current);
	const selectedTab = props.tabs.filter((t) => t.id === value)[0];

	return (
		<Layout direction="column" className={props.className}>
			<Layout direction="row">
				{props.tabs.map((tab) => (
					<Button type="button" key={tab.id} onClick={() => props.field.OnChange(tab.id)} label={tab.label} />
				))}
			</Layout>

			<Layout direction="column" children={[selectedTab.content()]} />
		</Layout>
	);
};

export default Tabs;
