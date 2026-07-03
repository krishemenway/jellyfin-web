import * as React from "react";
import { marked } from "marked";
import { createUseStyles } from "react-jss";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models"
import { Nullable } from "Common/MissingJavascriptFunctions"
import { MultiLineField } from "Common/TextField";
import { EditableItemProps } from "Items/EditableItemProps";
import { Button } from "Common/Button";
import { Layout } from "Common/Layout";

const useMarkdownStyles = createUseStyles({
	overview: {
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		gap: ".5rem",
	},
})

export const ItemOverview: React.FC<{ item: BaseItemDto; }&EditableItemProps> = (props) => {
	const element = React.useRef<HTMLDivElement>(null);
	const markdownStyles = useMarkdownStyles();
	const [showMore, setShowMore] = React.useState(false);
	const [showMoreVisible, setShowMoreVisible] = React.useState(true);
	const showAllOverview = React.useCallback(() => {
		setShowMore(true);
		setShowMoreVisible(false);
	}, [setShowMore, setShowMoreVisible]);

	React.useEffect(() => {
		if (element.current && element.current.children.length > 0) {
			setShowMoreVisible(Math.abs(element.current.scrollHeight - element.current.offsetHeight) > 2);
		}
	}, [element, props.item.Overview]);

	const overview = React.useMemo(() => marked.parse(props.item.Overview ?? "").toString(), [props.item.Overview]);

	if (props.isEditing && Nullable.HasValue(props.editableItem)) {
		return <MultiLineField field={props.editableItem.Overview} px=".25em" py=".25em" bt br bb bl backgroundColor="Field" />;
	}

	return Nullable.StringValue(overview, <></>, (o) => (
		<Layout direction="column" gap="1rem">
			<div className={`${props.item.Type}-overview ${markdownStyles.overview}`} style={{ maxHeight: showMore ? undefined : '5rem' }} ref={element} dangerouslySetInnerHTML={{ __html: o }} />
			{showMoreVisible && <Layout direction="row" justifyContent="end"><Button type="button" onClick={showAllOverview} px=".25em" py=".25em" label={{ Key: "ShowMore" }} /></Layout>}
		</Layout>
	));
};
