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

	public ToggleShuffle(): void {
		this.Shuffle.Value = !this.Shuffle.Value;
	}

	public ToggleRepeat(): void {
		this.Repeat.Value = !this.Repeat.Value;
	}

	public GoNext(): void {
		const current = this.Current.Value;
		const nextIndexToPlay = current !== undefined
			? this.Playlist.AsArray().indexOf(current.Item) + 1
			: 0;

		const itemToPlay = this.Playlist.AsArray()[nextIndexToPlay];
		if (itemToPlay !== undefined && Nullable.HasValue(itemToPlay.Id)) {
			this.Load(itemToPlay);
		}
	}

	public Stop(): void {
		const current = this.Current.Value;

		if (Nullable.HasValue(current)) {
			current.Audio.pause();
			current.Audio.fastSeek(0);
		}
	}

	public Pause(): void {
		const current = this.Current.Value;

		if (Nullable.HasValue(current)) {
			current.Audio.pause();
		}
	}

	public Play(): void {
		const current = this.Current.Value;

		if (Nullable.HasValue(current)) {
			current.Audio.play();
		}
	}

	public GoBack(): void {
		const current = this.Current.Value;
		const nextIndexToPlay = current !== undefined
			? Math.max(this.Playlist.AsArray().indexOf(current.Item) - 1, 0)
			: 0;

		const itemToPlay = this.Playlist.AsArray()[nextIndexToPlay];
		if (itemToPlay !== undefined && Nullable.HasValue(itemToPlay.Id)) {
			this.Load(itemToPlay);
		}
	}

	public Load(audio: BaseItemDto): void {
		const shouldStartPlaying = Nullable.HasValue(this.Current.Value) ? !this.Current.Value.Audio.paused : false;

		this.Unload();

		const audioElement = new Audio(this.CreateAudioUrl(audio));
		audioElement.addEventListener("timeupdate", (evt) => this.OnTimeUpdate(evt));

		if (shouldStartPlaying) {
			audioElement.addEventListener("loadeddata", () => { audioElement.play(); })
		}

		this.CurrentProgress.Value = 0;
		this.Current.Value = {
			Item: audio,
			Audio: audioElement,
		};
	}

	public Unload(): void {
		this.Stop();

		if (Nullable.HasValue(this.Current.Value)) {
			this.Current.Value.Audio.removeEventListener("timeupdate", (evt) => this.OnTimeUpdate(evt));
		}
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
