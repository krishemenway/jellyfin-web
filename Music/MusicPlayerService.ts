import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { DateTime, Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemService } from "Items/ItemsService";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";

export type AddPlaylistItemType = "ArtistName"|"AlbumId"|"PlaylistId"|"AudioId";

interface PlayItem {
	PlaylistItem: MediaPlaylistItem;
	Audio: HTMLAudioElement;
	TimeUpdateFunc: (evt: Event) => void;
	LoadedDataFunc: () => void;
	EndedFunc: () => void;
}

export class MusicPlayerService {
	constructor() {
		this.Current = new Observable(undefined);
		this.CurrentProgress = new Observable(0);
		this.Playlist = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
		this.State = new Observable(MediaPlayState.Stopped);
		this.HasPrevious = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() > 0);
		this.HasNext = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() < this.Playlist.length - 1);
		this.PlaySessionId = (new Date().getTime() + 1).toString();
	}

	public AddFromId(addType: AddPlaylistItemType, typeId: string, library: BaseItemDto, addAfterIndex?: number): void {
		const audioList = ItemService.Instance.FindOrCreateItemList(library.Id!, "Audio").List;
		
		switch (addType) {
			case "PlaylistId":
				this.MovePlaylistItem(parseInt(typeId, 10), addAfterIndex);
				break;
			case "AlbumId":
				this.AddRange((audioList.Data.Value.ReceivedData?.List ?? []).filter((i) => i.AlbumId === typeId).sort(SortByNumber((i) => i.IndexNumber)), addAfterIndex);
				break;
			case "ArtistName":
				this.AddRange((audioList.Data.Value.ReceivedData?.List ?? []).filter((i) => i.Artists?.includes(typeId)), addAfterIndex);
				break;
			case "AudioId":
				this.AddRange((audioList.Data.Value.ReceivedData?.List ?? []).filter((audio) => audio.Id === typeId), addAfterIndex);
				break;
		}
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.clear();
		this.AddRange(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Music;
	}

	public AddRange(items: BaseItemDto[], addAfterIndex?: number): void {
		const lengthBeforeAdding = this.Playlist.length;
		const playlistItems = items.map((item) => ({ Item: item }) as MediaPlaylistItem);

		this.AddRangeOfPlaylistItems(playlistItems, addAfterIndex);

		if (lengthBeforeAdding === 0 && this.Playlist.length > 0) {
			this.Load(this.Playlist.Value[0]);
		}
	}

	public Remove(item: MediaPlaylistItem): void {
		this.Playlist.remove(item);
	}

	public ToggleShuffle(): void {
		this.Shuffle.Value = !this.Shuffle.Value;
	}

	public ToggleRepeat(): void {
		this.Repeat.Value = !this.Repeat.Value;
	}

	public GoNext(): void {
		if (this.Shuffle.Value) {
			this.GoShuffle();
		} else if (this.Repeat.Value) {
			this.GoIndex(NumberLimits.NoGreaterThan(this.CurrentIndex() + 1, this.Playlist.length - 1, 0));
		} else {
			this.GoIndex(this.CurrentIndex() + 1);
		}
	}

	public GoBack(): void {
		if (this.Shuffle.Value) {
			this.GoShuffle();
		} else if (this.Repeat.Value) {
			this.GoIndex(NumberLimits.NoLessThan(this.CurrentIndex() - 1, 0, this.Playlist.length - 1));
		} else {
			this.GoIndex(this.CurrentIndex() - 1);
		}
	}

	public GoShuffle(): void {
		this.GoIndex(Math.round(Math.random() * this.Playlist.AsArray().length));
	}

	public GoIndex(index: number): void {
		Nullable.TryExecute(this.Playlist.AsArray()[index], (item) => {
			if (this.Current.Value?.PlaylistItem !== item) {
				this.Load(item);
			}
		}, () => { this.Stop(); });
	}

	public Load(playlistItem: MediaPlaylistItem): void {
		this.Stop();
		
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.removeEventListener("timeupdate", current.TimeUpdateFunc);
			current.Audio.removeEventListener("loadeddata", current.LoadedDataFunc);
			current.Audio.removeEventListener("ended", current.EndedFunc);
		});

		const onTimeUpdate = (evt: Event) => this.OnTimeUpdate(evt);
		const onLoaded = () => { this.Play(); };
		const onEnded = () => this.GoNext();

		const audioElement = new Audio(this.CreateAudioUrl(playlistItem.Item));
		audioElement.addEventListener("timeupdate", onTimeUpdate);
		audioElement.addEventListener("loadeddata", onLoaded);
		audioElement.addEventListener("ended", onEnded);

		this.CurrentProgress.Value = 0;
		this.Current.Value = {
			PlaylistItem: playlistItem,
			Audio: audioElement,
			TimeUpdateFunc: onTimeUpdate,
			LoadedDataFunc: onLoaded,
			EndedFunc: onEnded,
		};
	}

	public Stop(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.pause();
			current.Audio.fastSeek(0);

			getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStopped({ playbackStopInfo: {
				ItemId: current.PlaylistItem.Item.Id,
				MediaSourceId: current.PlaylistItem.Item.Id,
				PlaySessionId: this.PlaySessionId,
				PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			}});
		});

		this.State.Value = MediaPlayState.Stopped;
	}

	public Pause(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.pause();
			this.State.Value = MediaPlayState.Paused;
			
			getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
				ItemId: current.PlaylistItem.Item.Id,
				MediaSourceId: current.PlaylistItem.Item.Id,
				PlaySessionId: this.PlaySessionId,
				IsPaused: true,
				PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			}});
		});
	}

	public Play(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.play();
			this.State.Value = MediaPlayState.Playing;

			getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStart({ playbackStartInfo: {
				ItemId: current.PlaylistItem.Item.Id,
				MediaSourceId: current.PlaylistItem.Item.Id,
				PlaySessionId: this.PlaySessionId,
				CanSeek: true,
				IsMuted: false,
				IsPaused: false,
				PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
				RepeatMode: this.Repeat.Value ? "RepeatAll" : "RepeatNone",
			}});
		});
	}

	public ChangeProgress(newProgress: number): void {
		const currentState = this.State.Value;

		Nullable.TryExecute(this.Current.Value, (current) => { 
			current.Audio.fastSeek(newProgress);

			getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
				ItemId: current.PlaylistItem.Item.Id,
				MediaSourceId: current.PlaylistItem.Item.Id,
				PlaySessionId: this.PlaySessionId,
				IsPaused: currentState === MediaPlayState.Paused,
				PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			}});
		});
	}

	public Unload(): void {
		this.Stop();
	}

	private OnTimeUpdate(evt: Event): void {
		this.CurrentProgress.Value = (evt.currentTarget as HTMLAudioElement).currentTime;
	}

	private CurrentIndex(): number {
		return Nullable.Value(this.Current.Value, -1, (c) => this.Playlist.AsArray().indexOf(c.PlaylistItem));
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
	
	private AddRangeOfPlaylistItems(items: readonly MediaPlaylistItem[], addAfterIndex?: number): void {
		Nullable.TryExecute(addAfterIndex, (index) => {
			this.Playlist.push(...this.Playlist.splice(index, this.Playlist.length - index, ...items));
		}, () => {
			this.Playlist.push(...items);
		});
	}

	private MovePlaylistItem(atIndex: number, addAfterIndex?: number): void {
		const itemToMove = this.Playlist.splice(atIndex, 1);
		this.AddRangeOfPlaylistItems(itemToMove, addAfterIndex);
	}

	public Current: Observable<PlayItem|undefined>;
	public State: Observable<MediaPlayState>;
	public CurrentProgress: Observable<number>;
	public Playlist: ObservableArray<MediaPlaylistItem>;
	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	public HasPrevious: Computed<boolean>;
	public HasNext: Computed<boolean>;

	public PlaySessionId: string;

	static get Instance(): MusicPlayerService {
		return this._instance ?? (this._instance = new MusicPlayerService());
	}

	private static _instance: MusicPlayerService;
}
