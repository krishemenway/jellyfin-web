import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";

export class VideoPlayerService {
	constructor() {
		this.Current = new Observable(undefined);
		this.CurrentProgress = new Observable(0);
		this.Playlist = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
		this.State = new Observable(MediaPlayState.Stopped);
		this.HasPrevious = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() > 0);
		this.HasNext = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() < this.Playlist.length - 1);
		this.CurrentSource = new Computed(() => this.CreateSourceForCurrent());
		this.PlaySessionId = (new Date().getTime() + 1).toString();
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.clear();
		this.AddRange(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Video;
	}

	public AddRange(items: BaseItemDto[], addAfterIndex?: number): void {
		const lengthBeforeAdding = this.Playlist.length;
		const playlistItems = items.map((item) => ({ Item: item }) as MediaPlaylistItem);

		this.AddRangeOfPlaylistItems(playlistItems, addAfterIndex);

		if (lengthBeforeAdding === 0 && this.Playlist.length > 0) {
			this.Load(this.Playlist.Value[0]);
		}
	}

	public Stop(): void {
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
			if (this.Current.Value !== item) {
				this.Load(item);
			}
		}, () => { this.Stop(); });
	}

	public Unload(): void {
		this.Stop();
	}

	private Load(item: MediaPlaylistItem): void {
		this.Current.Value = item;
	}

	private CurrentIndex(): number {
		return Nullable.Value(this.Current.Value, -1, (item) => this.Playlist.AsArray().indexOf(item));
	}

	private AddRangeOfPlaylistItems(items: readonly MediaPlaylistItem[], addAfterIndex?: number): void {
		Nullable.TryExecute(addAfterIndex, (index) => {
			this.Playlist.push(...this.Playlist.splice(index, this.Playlist.length - index, ...items));
		}, () => {
			this.Playlist.push(...items);
		});
	}

	private CreateSourceForCurrent(): string {
		const current = this.Current.Value;
		const api = ServerService.Instance.CurrentApi;

		if (current === undefined) {
			return "";
		}

		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId.Value,
			DeviceId: api.deviceInfo.id,
			api_key: api.accessToken,
			PlaySessionId: this.PlaySessionId,
			MediaSourceId: current.Item.Id ?? "",
			// Tag=ae67e3fe9fa2d716e32ee932788680cb
		});

		return `${api.basePath}/Videos/${current.Item.Id}/stream.mp4?${queryParams.toString()}`;
	}

	public Current: Observable<MediaPlaylistItem|undefined>;
	public State: Observable<MediaPlayState>;
	public CurrentProgress: Observable<number>;
	public Playlist: ObservableArray<MediaPlaylistItem>;
	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	public CurrentSource: Computed<string>;
	public HasPrevious: Computed<boolean>;
	public HasNext: Computed<boolean>;

	public PlaySessionId: string;

	static get Instance(): VideoPlayerService {
		return this._instance ?? (this._instance = new VideoPlayerService());
	}

	private static _instance: VideoPlayerService;
}
