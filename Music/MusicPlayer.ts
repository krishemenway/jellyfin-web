import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";

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
		this.Current = new Observable(undefined);
		this.CurrentProgress = new Observable(0);
		this.Playlist = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
	}

	public Add(item: BaseItemDto): void {
		const newPlaylistItem: PlaylistItem = {
			Item: item,
		};

		this.Playlist.push(newPlaylistItem);

		if (this.Playlist.length === 1) {
			this.Load(newPlaylistItem);
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
			const nextIndex = this.CurrentIndex() + 1;

			if (nextIndex < this.Playlist.length) {
				this.GoIndex(nextIndex);
			}
		}
	}

	public GoBack(): void {
		if (this.Shuffle.Value) {
			this.GoShuffle();
		} else if (this.Repeat.Value) {
			this.GoIndex(NumberLimits.NoLessThan(this.CurrentIndex() - 1, 0, this.Playlist.length - 1));
		} else {
			const nextIndex = this.CurrentIndex() - 1;

			if (nextIndex > -1) {
				this.GoIndex(nextIndex);
			}
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
		});
	}

	public Load(playlistItem: PlaylistItem): void {
		this.Stop();
		
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.removeEventListener("timeupdate", current.TimeUpdateFunc);
			current.Audio.removeEventListener("loadeddata", current.LoadedDataFunc);
			current.Audio.removeEventListener("ended", current.EndedFunc);
		});

		const onTimeUpdate = (evt: Event) => this.OnTimeUpdate(evt);
		const onLoaded = () => { audioElement.play(); };
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
		Nullable.TryExecute(this.Current.Value, (current) => { current.Audio.pause(); current.Audio.fastSeek(0); });
	}

	public Pause(): void {
		Nullable.TryExecute(this.Current.Value, (current) => { current.Audio.pause(); });
	}

	public Play(): void {
		Nullable.TryExecute(this.Current.Value, (current) => { current.Audio.play(); });
	}

	public ChangeProgress(newProgress: number): void {
		Nullable.TryExecute(this.Current.Value, (current) => { current.Audio.fastSeek(newProgress); });
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
			PlaySessionId: "157896144",
			StartTimeTicks: "0",
			EnableRedirection: "true",
			EnableRemoteMedia: "false",
			EnableAudioVbrEncoding: "true"
		});

		return `${ServerService.Instance.CurrentApi.basePath}/Audio/${item.Id}/universal?${queryParams.toString()}`;
	}

	public Current: Observable<PlayItem|undefined>;
	public CurrentProgress: Observable<number>;
	public Playlist: ObservableArray<PlaylistItem>;
	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	static get Instance(): MusicPlayer {
		return this._instance ?? (this._instance = new MusicPlayer());
	}

	private static _instance: MusicPlayer;
}
