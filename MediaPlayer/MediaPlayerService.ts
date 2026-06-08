import { Observable } from "@residualeffect/reactor";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";

export class MediaPlayerService {
	constructor() {
		this.PlayerType = new Observable(MediaPlayerType.None);
	}

	public SetPlayer(type: MediaPlayerType): void {
		if (this.PlayerType.Value !== type) {
			this.PlayerType.Value = type;
		}
	}

	public PlayerType: Observable<MediaPlayerType>;

	static get Instance(): MediaPlayerService {
		return this._instance ?? (this._instance = new MediaPlayerService());
	}

	private static _instance: MediaPlayerService;
}
