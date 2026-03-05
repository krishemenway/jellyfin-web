import { Computed, Observable, ObservableArray } from "@residualeffect/reactor";
import { Nullable, NumberLimits } from "Common/MissingJavascriptFunctions";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export class MediaPlayerPlaylist {
	constructor() {
		this.Current = new Observable(undefined);
		this.ItemsInOrder = new ObservableArray([]);
		this.Repeat = new Observable(false);
		this.Shuffle = new Observable(false);
		this.IsVisible = new Observable(false);
		this.HasPrevious = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() > 0);
		this.HasNext = new Computed(() => this.Shuffle.Value || this.Repeat.Value || this.CurrentIndex() < this.ItemsInOrder.length - 1);
	}

	public Reset(): void {
		this.ItemsInOrder.clear();
		this.Current.Value = undefined;
		this.Repeat.Value = false;
		this.Shuffle.Value = false;
		this.IsVisible.Value = false;
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

	public Current: Observable<MediaPlaylistItem|undefined>;

	public ItemsInOrder: ObservableArray<MediaPlaylistItem>;

	public Repeat: Observable<boolean>;
	public Shuffle: Observable<boolean>;

	public IsVisible: Observable<boolean>;
	
	public HasPrevious: Computed<boolean>;
	public HasNext: Computed<boolean>;

	private _lastUsedId: number = 1;
}
