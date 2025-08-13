import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { useBackgroundStyles } from "AppStyles";
import { MusicPlayer } from "Music/MusicPlayer";
import { Layout } from "Common/Layout";
import { MusicPlayerStatus } from "Music/MusicPlayerStatus";

export const PortableMusicPlayer: React.FC = () => {
	const background = useBackgroundStyles();
	const portablePlayerOpen = useObservable(MusicPlayer.Instance.PortablePlayerOpen);

	if (!portablePlayerOpen) {
		return <></>;
	}

	return (
		<Layout className={background.alternatePanel} direction="column" position="fixed" bottom="1em" right="1em" minWidth="25em" maxWidth="30em">
			<MusicPlayerStatus forPortable />
		</Layout>
	);
};
