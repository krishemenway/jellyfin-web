import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { Layout, StyleLayoutProps } from "Common/Layout";
import { useBackgroundStyles } from "AppStyles";
import { TranslatedText } from "Common/TranslatedText";
import { Button } from "Common/Button";
import { MediaPlayStateIcon } from "MediaPlayer/MediaPlayStateIcon";
import { Virtuoso } from "react-virtuoso";
import { DeleteIcon } from "CommonIcons/DeleteIcon";
import { DragIcon } from "CommonIcons/DragIcon";
import { MediaPlayerPlaylist } from "MediaPlayer/MediaPlayerPlaylist";

export const CurrentPlaylist: React.FC<{ playlist: MediaPlayerPlaylist }&StyleLayoutProps> = ({ playlist, ...props }) => {
	const background = useBackgroundStyles();
	const itemsInPlaylist = useObservable(playlist.ItemsInOrder);
	const current = useObservable(playlist.Current);
	const playState = useObservable(playlist.State);

	return (
		<Layout
			{...props}
			direction="column" grow py=".25em" px=".25em"
			onDragOver={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "copy";

				Nullable.TryExecute((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, (element) => {
					const elementMidpoint = element.getBoundingClientRect().height / 2;
					
					if (evt.nativeEvent.offsetY > elementMidpoint) {
						element.style.borderTopStyle = "";
						element.style.borderBottomStyle = "solid";
					} else {
						element.style.borderTopStyle = "solid";
						element.style.borderBottomStyle = "";
					}
				});
			}}
			onDragLeave={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "copy";

				Nullable.TryExecute((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, (element) => {
					element.style.borderStyle = "";
				});
			}}
			onDrop={(evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect ="copy";

				const addAfterIndex = Nullable.Value((evt.target as HTMLElement).closest("*[data-index]") as HTMLElement|undefined|null, undefined, (element) => {
					const index = parseInt(element.attributes.getNamedItem("data-index")?.value ?? "0", 10);
					const elementMidpoint = element.getBoundingClientRect().height / 2;
					element.style.borderStyle = "";

					return evt.nativeEvent.offsetY > elementMidpoint ? index : index - 1;
				});

				playlist.HandleDrop(evt.dataTransfer, addAfterIndex);
			}}
		>
			{itemsInPlaylist.length > 0 ? (
				<Virtuoso
					data={itemsInPlaylist}
					computeItemKey={(_, item) => item.Id}
					style={{ height: "100%", width: "100%" }}
					itemContent={(index, data) => (
						<Layout direction="row" position="relative" draggable onDragStart={(evt) => { evt.dataTransfer.setData("AddType", "MovePlaylistItem"); evt.dataTransfer.setData("PlaylistIndex", index.toString()); }}>
							<Layout direction="column" alignItems="center" justifyContent="center" position="absolute" top={0} bottom={0} left={0} width="5%">
								{Nullable.Value(current, <DragIcon />, (c) => c === data ? <MediaPlayStateIcon state={playState} /> : <DragIcon />)}
							</Layout>

							<Button transparent width="100%" px="5%" type="button" textAlign="start" onClick={() => { playlist.GoIndex(index)}}>
								<Layout direction="column" px=".5em" py=".5em" width="80%">{data.Item.Name}</Layout>
								<Layout direction="column" px=".5em" py=".5em" justifyContent="center" alignItems="end" width="20%">{DateTime.ConvertTicksToDurationString(data.Item.RunTimeTicks)}</Layout>
							</Button>

							<Button
								type="button" onClick={() => { playlist.Remove(data); }}
								direction="column" alignItems="center" justifyContent="center" transparent
								position="absolute" top={0} bottom={0} right={0} width="5%"
								icon={<DeleteIcon />}
							/>
						</Layout>
					)}
				/>
			) : (
				<Layout classes={[background.dashed]} direction="column" justifyContent="center" alignItems="center" width="100%" grow>
					<TranslatedText textKey="AddToPlaylist" />
				</Layout>
			)}
		</Layout>
	);
};
