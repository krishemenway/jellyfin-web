import { Observable } from "@residualeffect/reactor";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";

export class MediaPlayerService {
	constructor() {
		this.PlayerType = new Observable(MediaPlayerType.None);
		this.IsFullscreen = new Observable(false);
	}

	public PlayerType: Observable<MediaPlayerType>;
	public IsFullscreen: Observable<boolean>;

	static get Instance(): MediaPlayerService {
		return this._instance ?? (this._instance = new MediaPlayerService());
	}

	private static _instance: MediaPlayerService;
}
