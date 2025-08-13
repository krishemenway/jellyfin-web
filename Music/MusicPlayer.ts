import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { DateTime, Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemService } from "Items/ItemsService";
import { ServerService } from "Servers/ServerService";

export type AddPlaylistItemType = "ArtistName"|"AlbumId"|"PlaylistId"|"AudioId";

export enum PlayState {
	Stopped,
	Paused,
	Playing,
}

interface PlayItem {
	PlaylistItem: PlaylistItem;
	Audio: HTMLAudioElement;
	TimeUpdateFunc: (evt: Event) => void;
	LoadedDataFunc: () => void;
	EndedFunc: () => void;
}

interface PlaylistItem {
	Item: BaseItemDto;
}

export class MusicPlayer {
	constructor() {
		this.PortablePlayerOpen = new Observable(false);
		this.Current = new Observable(undefined);
		this.CurrentProgress = new Observable(0);
		this.Playlist = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
		this.State = new Observable(PlayState.Stopped);
		this.PlaySessionId = (new Date().getTime() + 1).toString();
	}

	public CloseMiniPlayerAndReopenIfNecessary(): () => void {
		this.PortablePlayerOpen.Value = false;
		return () => { this.PortablePlayerOpen.Value = this.State.Value !== PlayState.Stopped; };
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

	public AddRange(items: BaseItemDto[], addAfterIndex?: number): void {
		const lengthBeforeAdding = this.Playlist.length;
		const playlistItems = items.map((item) => ({ Item: item }) as PlaylistItem);

		this.AddRangeOfPlaylistItems(playlistItems, addAfterIndex);

		if (lengthBeforeAdding === 0 && this.Playlist.length > 0) {
			this.Load(this.Playlist.Value[0]);
		}
	}

	public Remove(item: PlaylistItem): void {
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

	public Load(playlistItem: PlaylistItem): void {
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

		this.State.Value = PlayState.Stopped;
	}

	public Pause(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.pause();
			this.State.Value = PlayState.Paused;
			
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
			this.State.Value = PlayState.Playing;

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
				IsPaused: currentState === PlayState.Paused,
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
		return Nullable.ValueOrDefault(this.Current.Value, -1, (c) => this.Playlist.AsArray().indexOf(c.PlaylistItem));
	}

	private CreateAudioUrl(item: BaseItemDto): string {
		const api = ServerService.Instance.CurrentApi;

		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId,
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
	
	private AddRangeOfPlaylistItems(items: readonly PlaylistItem[], addAfterIndex?: number): void {
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
	public State: Observable<PlayState>;
	public CurrentProgress: Observable<number>;
	public Playlist: ObservableArray<PlaylistItem>;
	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;
	public PortablePlayerOpen: Observable<boolean>;
	public PlaySessionId: string;

	static get Instance(): MusicPlayer {
		return this._instance ?? (this._instance = new MusicPlayer());
	}

	private static _instance: MusicPlayer;
}
