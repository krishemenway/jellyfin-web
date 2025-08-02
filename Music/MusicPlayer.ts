import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Observable, ObservableArray } from "@residualeffect/reactor";

interface PlayItem {
	Item: BaseItemDto;
	Audio: HTMLAudioElement;
}

export class MusicPlayer {
	constructor() {
		this.Current = new Observable(undefined);
		this.Playlist = new ObservableArray([]);
	}

	public Current: Observable<PlayItem|undefined>;
	public Playlist: ObservableArray<BaseItemDto>;

	static get Instance(): MusicPlayer {
		return this._instance ?? (this._instance = new MusicPlayer());
	}

	private static _instance: MusicPlayer;
}
