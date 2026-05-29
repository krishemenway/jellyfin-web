import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { DateTime, Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";

export class MediaPlayerPlaylist {
	constructor() {
		this.Current = new Observable(undefined);
		this.ItemsInOrder = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
		this.IsVisible = new Observable(false);
		this.HasPrevious = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() > 0);
		this.HasNext = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() < this.ItemsInOrder.length - 1);
		this.State = new Observable(MediaPlayState.Stopped);
		this.CurrentProgress = new Observable(0);
		this.PlaySessionId = (new Date().getTime() + 1).toString();
		this.ProgressUpdateInterval = undefined;
	}

	public Reset(): void {
		this.ItemsInOrder.clear();
		this.Current.Value = undefined;
		this.Repeat.Value = false;
		this.Shuffle.Value = false;
		this.IsVisible.Value = false;
		this.StopReportingProgress();
	}

	public Play(): void {
		if (this.State.Value === MediaPlayState.Playing) {
			return;
		}

		this.State.Value = MediaPlayState.Playing;

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStart({ playbackStartInfo: {
			ItemId: this.Current.Value?.Item.Id,
			MediaSourceId: this.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			CanSeek: true,
			IsMuted: false,
			IsPaused: false,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			RepeatMode: this.Repeat.Value ? "RepeatAll" : "RepeatNone",
		}});

		this.StartReportingProgress();
	}

	public Stop(): void {
		if (this.State.Value === MediaPlayState.Stopped) {
			return;
		}

		this.State.Value = MediaPlayState.Stopped;

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStopped({ playbackStopInfo: {
			ItemId: this.Current.Value?.Item.Id,
			MediaSourceId: this.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});

		this.StopReportingProgress();
	}

	public Pause(): void {
		if (this.State.Value === MediaPlayState.Paused) {
			return;
		}

		this.State.Value = MediaPlayState.Paused;
		
		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
			ItemId: this.Current.Value?.Item.Id,
			MediaSourceId: this.Current.Value?.Item.Id,
			PlaySessionId: this.PlaySessionId,
			IsPaused: true,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});

		this.StopReportingProgress();
	}

	public Finished(): void {
		this.State.Value = MediaPlayState.Stopped;
		const itemId = this.Current.Value?.Item.Id;

		getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackStopped({ playbackStopInfo: {
			ItemId: this.Current.Value?.Item.Id,
			MediaSourceId: itemId,
			PlaySessionId: this.PlaySessionId,
			PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
		}});

		this.GoNext();
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.ItemsInOrder.clear();
		this.AddRangeOfPlaylistItems(items.map((item) => this.CreateItem(item)));
		this.GoIndex(0);
	}

	public AddRange(items: BaseItemDto[], afterIndex?: number): void {
		this.AddRangeOfPlaylistItems(items.map((item) => this.CreateItem(item)), afterIndex);
	}

	public Remove(item: MediaPlaylistItem): void {
		this.ItemsInOrder.remove(item);
	}

	public GoNext(): void {
		if (this.Shuffle.Value) {
			this.GoShuffle();
		} else if (this.Repeat.Value) {
			this.GoIndex(NumberLimits.NoGreaterThan(this.CurrentIndex() + 1, this.ItemsInOrder.length - 1, 0));
		} else {
			this.GoIndex(this.CurrentIndex() + 1);
		}
	}

	public GoBack(): void {
		if (this.Shuffle.Value) {
			this.GoShuffle();
		} else if (this.Repeat.Value) {
			this.GoIndex(NumberLimits.NoLessThan(this.CurrentIndex() - 1, 0, this.ItemsInOrder.length - 1));
		} else {
			this.GoIndex(this.CurrentIndex() - 1);
		}
	}

	public GoShuffle(): void {
		this.GoIndex(Math.round(Math.random() * this.ItemsInOrder.AsArray().length));
	}

	public GoIndex(index: number): void {
		Nullable.TryExecute(this.ItemsInOrder.AsArray()[index], (item) => {
			if (this.Current.Value !== item) {
				this.Current.Value = item;
			}
		});
	}

	public ToggleShuffle(): void {
		this.Shuffle.Value = !this.Shuffle.Value;
	}

	public ToggleRepeat(): void {
		this.Repeat.Value = !this.Repeat.Value;
	}

	public TogglePlaylist(): void {
		this.IsVisible.Value = !this.IsVisible.Value;
	}

	public MovePlaylistItem(atIndex: number, addAfterIndex?: number): void {
		const addAfterIndexOrMax = Math.min(this.ItemsInOrder.length, addAfterIndex ?? (this.ItemsInOrder.length - 1));

		if (atIndex !== addAfterIndexOrMax) {
			const items = this.ItemsInOrder.Value.slice();
			const itemToAddAfter = items[addAfterIndexOrMax];
			const itemToMove = items.splice(atIndex, 1)[0];
			const indexToAddAfter = items.indexOf(itemToAddAfter);
			items.splice(indexToAddAfter + 1, 0, itemToMove);

			this.ItemsInOrder.Value = items;
		}
	}

	public AddRangeOfPlaylistItems(items: readonly MediaPlaylistItem[], addAfterIndex?: number): void {
		Nullable.TryExecute(addAfterIndex, (index) => {
			this.ItemsInOrder.push(...this.ItemsInOrder.splice(index, this.ItemsInOrder.length - index, ...items));
		}, () => {
			this.ItemsInOrder.push(...items);
		});
	}

	private CurrentIndex(): number {
		return Nullable.Value(this.Current.Value, -1, (c) => this.ItemsInOrder.AsArray().indexOf(c));
	}

	private CreateItem(from: BaseItemDto): MediaPlaylistItem {
		return {
			Id: (this._lastUsedId++).toString(),
			Item: from,
		};
	}

	private StartReportingProgress(): void {
		this.ProgressUpdateInterval = window.setInterval(() => {
			getPlaystateApi(ServerService.Instance.CurrentApi).reportPlaybackProgress({ playbackProgressInfo: {
				ItemId: this.Current.Value?.Item.Id,
				MediaSourceId: this.Current.Value?.Item.Id,
				PlaySessionId: this.PlaySessionId,
				IsPaused: false,
				PositionTicks: parseInt((this.CurrentProgress.Value * DateTime.TicksPerSecond).toString(), 10),
			}});
		}, this._progressUpdateIntervalDurationInMilliseconds);
	}

	private StopReportingProgress(): void {
		Nullable.TryExecute(this.ProgressUpdateInterval, (interval) => {
			window.clearInterval(interval);
			this.ProgressUpdateInterval = undefined;
		});
	}

	public Current: Observable<MediaPlaylistItem|undefined>;
	public State: Observable<MediaPlayState>;

	public ItemsInOrder: ObservableArray<MediaPlaylistItem>;

	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	public IsVisible: Observable<boolean>;
	
	public HasPrevious: Computed<boolean>;
	public HasNext: Computed<boolean>;
	public PlaySessionId: string;
	public CurrentProgress: Observable<number>;

	private ProgressUpdateInterval: number|undefined;

	private _progressUpdateIntervalDurationInMilliseconds = 10000;
	private _lastUsedId: number = 1;
}
