import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { Observable } from "@residualeffect/reactor";
import { DateTime, Nullable } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemService } from "Items/ItemsService";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";
import { MediaPlayerPlaylist } from "MediaPlayer/MediaPlayerPlaylist";

export type MusicPlayerDropActionType = "MovePlaylistItem"|"AudioId"|"AlbumId-SongList"|"ArtistName-SongList"|"AudioId-SongList";

export class MusicPlayerService {
	constructor() {
		this.AudioElement = new Audio();
		this.CurrentProgress = new Observable(0);
		this.Playlist = new MediaPlayerPlaylist();
		this.PlaySessionId = (new Date().getTime() + 1).toString();
		this.State = new Observable(MediaPlayState.Stopped);

		this.AudioElement.addEventListener("timeupdate", (evt: Event) => this.OnTimeUpdate(evt));
		this.AudioElement.addEventListener("loadeddata", () => { this.Play(); });
		this.AudioElement.addEventListener("ended", () => this.Playlist.GoNext());

		this.Playlist.Current.Subscribe((newItem) => {
			if (newItem === undefined) {
				this.Unload();
			} else {
				this.Load(newItem);
			}
		})
	}

	public HandleDrop(dataTransfer: DataTransfer, afterIndex?: number): void {
		const addType = dataTransfer.getData("AddType") as MusicPlayerDropActionType;
		const addTypeId = dataTransfer.getData("AddTypeId");
		
		switch (addType) {
			case "MovePlaylistItem":
				this.Playlist.MovePlaylistItem(parseInt(addTypeId, 10), afterIndex);
				break;
			case "AudioId":
				this.AddItemsFromDataToPlaylist(dataTransfer, (item) => item.Id === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "ArtistName-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.Artists?.includes(addTypeId) ?? false, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "AlbumId-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.AlbumId === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "AudioId-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.Id === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
		}
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.ClearAndPlay(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Music;
	}

	public Load(playlistItem: MediaPlaylistItem): void {
		this.Stop();
		this.CurrentProgress.Value = 0;
		this.AudioElement.src = this.CreateAudioUrl(playlistItem.Item);
	}

	public Stop(): void {
		this.AudioElement.pause();
		this.AudioElement.fastSeek(0);
		this.State.Value = MediaPlayState.Stopped;

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStopped({ playbackStopInfo: {
			ItemId: this.Playlist.Current.Value?.Item.Id,
			MediaSourceId: this.Playlist.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});
	}

	public Pause(): void {
		this.AudioElement.pause();
		this.State.Value = MediaPlayState.Paused;
		
		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
			ItemId: this.Playlist.Current.Value?.Item.Id,
			MediaSourceId: this.Playlist.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			IsPaused: true,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});
	}

	public Play(): void {
		this.AudioElement.play();
		this.State.Value = MediaPlayState.Playing;

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStart({ playbackStartInfo: {
			ItemId: this.Playlist.Current.Value?.Item.Id,
			MediaSourceId: this.Playlist.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			CanSeek: true,
			IsMuted: false,
			IsPaused: false,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			RepeatMode: this.Playlist.Repeat.Value ? "RepeatAll" : "RepeatNone",
		}});
	}

	public ChangeProgress(newProgress: number): void {
		const currentState = this.State.Value;

		this.AudioElement.fastSeek(newProgress);

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
			ItemId: this.Playlist.Current.Value?.Item.Id,
			MediaSourceId: this.Playlist.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			IsPaused: currentState === MediaPlayState.Paused,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});
	}

	public Unload(): void {
		this.Stop();
		this.Playlist.Reset();
	}

	private AddItemsFromDataToPlaylist(dataTransfer: DataTransfer, filterItemsFunc: (item: BaseItemDto) => boolean, sortFunc: (a: BaseItemDto, b: BaseItemDto) => number, afterIndex?: number): void {
		Nullable.TryExecute(dataTransfer.getData("AddFromChildrenOfId"), (childrenOfId) => {
			const childrenToSearch = ItemService.Instance.FindOrCreateItemData(childrenOfId).Children;
			this.Playlist.AddRange((childrenToSearch.Data.Value.ReceivedData ?? []).filter(filterItemsFunc).sort(sortFunc), afterIndex);
		});
	}

	private AddItemsFromListToPlaylist(dataTransfer: DataTransfer, kind: BaseItemKind, filterItemsFunc: (item: BaseItemDto) => boolean, sortFunc: (a: BaseItemDto, b: BaseItemDto) => number, afterIndex?: number): void {
		Nullable.TryExecute(dataTransfer.getData("AddFromLibrary"), (libraryId) => {
			const childrenToSearch = ItemService.Instance.FindOrCreateItemList(libraryId, kind).List;
			this.Playlist.AddRange((childrenToSearch.Data.Value.ReceivedData?.List ?? []).filter(filterItemsFunc).sort(sortFunc), afterIndex);
		});
	}

	private OnTimeUpdate(evt: Event): void {
		this.CurrentProgress.Value = (evt.currentTarget as HTMLAudioElement).currentTime;
	}

	private CreateAudioUrl(item: BaseItemDto): string {
		const api = ServerService.Instance.CurrentApi;

		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId.Value,
			DeviceId: api.deviceInfo.id,
			MaxStreamingBitrate: "321754827",
			Container: "opus,webm|opus,ts|mp3,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg",
			TranscodingContainer: "mp4",
			TranscodingProtocol: "hls",
			AudioCodec: "aac",
			api_key: api.accessToken,
			PlaySessionId: this.PlaySessionId,
			StartTimeTicks: "0",
			EnableRedirection: "true",
			EnableRemoteMedia: "false",
			EnableAudioVbrEncoding: "true"
		});

		return `${ServerService.Instance.CurrentApi.basePath}/Audio/${item.Id}/universal?${queryParams.toString()}`;
	}

	public CurrentProgress: Observable<number>;
	public Playlist: MediaPlayerPlaylist;
	public PlaySessionId: string;
	public State: Observable<MediaPlayState>;

	private AudioElement: HTMLAudioElement;

	static get Instance(): MusicPlayerService {
		return this._instance ?? (this._instance = new MusicPlayerService());
	}

	private static _instance: MusicPlayerService;
}
