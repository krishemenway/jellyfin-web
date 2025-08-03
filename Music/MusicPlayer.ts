import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";

interface PlayItem {
	Item: BaseItemDto;
	Audio: HTMLAudioElement;
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
		this.Playlist.push(item);

		if (this.Playlist.length === 1) {
			this.Load(item);
		}
	}

	public ChangeProgress(newProgress: number): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.fastSeek(newProgress);
		});
	}

	public ToggleShuffle(): void {
		this.Shuffle.Value = !this.Shuffle.Value;
	}

	public ToggleRepeat(): void {
		this.Repeat.Value = !this.Repeat.Value;
	}

	public GoNext(): void {
		const current = this.Current.Value;
		const nextIndexToPlay = Nullable.HasValue(current)
			? this.Playlist.AsArray().indexOf(current.Item) + 1
			: 0;

		Nullable.TryExecute(this.Playlist.AsArray()[nextIndexToPlay], (item) => {
			this.Load(item);
		});
	}

	public GoBack(): void {
		const current = this.Current.Value;
		const nextIndexToPlay = Nullable.HasValue(current)
			? Math.max(this.Playlist.AsArray().indexOf(current.Item) - 1, 0)
			: 0;

		Nullable.TryExecute(this.Playlist.AsArray()[nextIndexToPlay], (item) => {
			this.Load(item);
		});
	}

	public Load(audio: BaseItemDto): void {
		const onTimeUpdate = (evt: Event) => this.OnTimeUpdate(evt);
		const onLoaded = () => { audioElement.play(); };
		const onEnded = () => this.GoNext();

		this.Stop();
		
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.removeEventListener("timeupdate", onTimeUpdate);
			current.Audio.removeEventListener("loadeddata", onLoaded);
			current.Audio.removeEventListener("ended", onEnded);
		});

		const audioElement = new Audio(this.CreateAudioUrl(audio));
		audioElement.addEventListener("timeupdate", onTimeUpdate);
		audioElement.addEventListener("loadeddata", onLoaded);
		audioElement.addEventListener("ended", onEnded);

		this.CurrentProgress.Value = 0;
		this.Current.Value = {
			Item: audio,
			Audio: audioElement,
		};
	}

	public Stop(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.pause();
			current.Audio.fastSeek(0);
		});
	}

	public Pause(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.pause();
		});
	}

	public Play(): void {
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.play();
		});
	}

	public Unload(): void {
		this.Stop();
	}

	private OnTimeUpdate(evt: Event): void {
		this.CurrentProgress.Value = (evt.currentTarget as HTMLAudioElement).currentTime;
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
	public Playlist: ObservableArray<BaseItemDto>;
	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	static get Instance(): MusicPlayer {
		return this._instance ?? (this._instance = new MusicPlayer());
	}

	private static _instance: MusicPlayer;
}
