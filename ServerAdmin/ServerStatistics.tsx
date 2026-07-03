import * as React from "react";
import { Layout } from "Common/Layout";
import { ItemCounts, SystemInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { getLibraryApi } from "@jellyfin/sdk/lib/utils/api";
import { TranslatedText } from "Common/TranslatedText";
import { ListOf } from "Common/ListOf";
import { Receiver } from "Common/Receiver";
import { ServerService } from "Servers/ServerService";
import { Loading } from "Common/Loading";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { LoadingIcon } from "Common/LoadingIcon";

interface Statistic {
	label: string;
	value?: string|null;
}

const countsReceiver = new Receiver<ItemCounts>("UnknownError");

export const ServerStatistics: React.FC = () => {
	React.useEffect(() => {
		countsReceiver.Start((a) => getLibraryApi(ServerService.Instance.CurrentApi).getItemCounts({ }, { signal: a.signal }).then(r => r.data));
		return () => countsReceiver.ResetIfLoading();
	}, []);

	return (
		<Loading
			receivers={[ServerService.Instance.ServerInfo, countsReceiver]}
			whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
			whenLoading={<LoadingIcon alignSelf="center" size="3rem" />}
			whenNotStarted={<LoadingIcon alignSelf="center" size="3rem" />}
			whenReceived={(server, counts) => <LoadedStatistics server={server} libraryCounts={counts} />}
		/>
	);
}

const LoadedStatistics: React.FC<{ server: SystemInfo; libraryCounts: ItemCounts }> = ({ server, libraryCounts }) => {
	const versionStatistics = React.useMemo(() => [
		{ label: "LabelServerVersion", value: server.Version },
		{ label: "LabelWebVersion", value: server.Version },
	] as Statistic[], [server]);
	const libraryStatistics = React.useMemo(() => createStatisticsForItemCounts(libraryCounts), [libraryCounts]);

	return (
		<Layout direction="column" gap=".5rem" backgroundColor="Panel" bt br bb bl grow>
			<ListOf
				px="1rem" py="1rem"
				items={versionStatistics} direction="column" gap=".5rem"
				forEachItem={(statistic) => (
					<Layout key={statistic.label} direction="row" gap="2em" justifyContent="space-between">
						<TranslatedText textKey={statistic.label} />
						<Layout direction="row">{statistic.value}</Layout>
					</Layout>
				)}
			/>

			<ListOf
				px="1rem" py="1rem"
				items={libraryStatistics} direction="column" gap=".5rem"
				forEachItem={(statistic) => (
					<Layout key={statistic.label} direction="row" gap="2em" justifyContent="space-between">
						<TranslatedText textKey={statistic.label} />
						<Layout direction="row">{statistic.value}</Layout>
					</Layout>
				)}
			/>
		</Layout>
	);
};

function createStatisticsForItemCounts(counts: ItemCounts): Statistic[] {
	const allStats: Statistic[] = [];
	tryAddStatisticsForCount(allStats, counts.MovieCount, "TypeOptionPluralMovie");
	tryAddStatisticsForCount(allStats, counts.SeriesCount, "TypeOptionPluralSeries");
	tryAddStatisticsForCount(allStats, counts.EpisodeCount, "TypeOptionPluralEpisode");
	tryAddStatisticsForCount(allStats, counts.BookCount, "TypeOptionPluralBook");
	tryAddStatisticsForCount(allStats, counts.AlbumCount, "TypeOptionPluralMusicAlbum");
	tryAddStatisticsForCount(allStats, counts.ArtistCount, "TypeOptionPluralMusicArtist");
	tryAddStatisticsForCount(allStats, counts.SongCount, "Songs");
	tryAddStatisticsForCount(allStats, counts.MusicVideoCount, "TypeOptionPluralMusicVideo");
	tryAddStatisticsForCount(allStats, counts.BoxSetCount, "TypeOptionPluralBoxSet");
	tryAddStatisticsForCount(allStats, counts.TrailerCount, "Trailers");
	tryAddStatisticsForCount(allStats, counts.ProgramCount, "Programs");
	return allStats;
}

function tryAddStatisticsForCount(all: Statistic[], count: number|undefined, label: string): void {
	if ((count ?? 0) > 0) {
		all.push({
			label: label,
			value: count?.toLocaleString(),
		});
	}
}
