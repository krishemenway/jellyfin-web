import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { ServerService } from "Servers/ServerService";

interface PlayItem {
	PlaylistItem: PlaylistItem;
	Audio: HTMLAudioElement;
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
		this.GoIndex(Nullable.ValueOrDefault(this.Current.Value, 0, (current) => this.Playlist.AsArray().indexOf(current.PlaylistItem) + 1));
	}

	public GoBack(): void {
		this.GoIndex(Nullable.ValueOrDefault(this.Current.Value, 0, (current) => Math.max(this.Playlist.AsArray().indexOf(current.PlaylistItem) - 1, 0)));
	}

	public GoIndex(index: number): void {
		Nullable.TryExecute(this.Playlist.AsArray()[index], (item) => {
			this.Load(item);
		});
	}

	public Load(playlistItem: PlaylistItem): void {
		const onTimeUpdate = (evt: Event) => this.OnTimeUpdate(evt);
		const onLoaded = () => { audioElement.play(); };
		const onEnded = () => this.GoNext();

		this.Stop();
		
		Nullable.TryExecute(this.Current.Value, (current) => {
			current.Audio.removeEventListener("timeupdate", onTimeUpdate);
			current.Audio.removeEventListener("loadeddata", onLoaded);
			current.Audio.removeEventListener("ended", onEnded);
		});

		const audioElement = new Audio(this.CreateAudioUrl(playlistItem.Item));
		audioElement.addEventListener("timeupdate", onTimeUpdate);
		audioElement.addEventListener("loadeddata", onLoaded);
		audioElement.addEventListener("ended", onEnded);

		this.CurrentProgress.Value = 0;
		this.Current.Value = {
			PlaylistItem: playlistItem,
			Audio: audioElement,
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
