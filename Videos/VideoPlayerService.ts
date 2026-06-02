import { BaseItemDto, PlaybackInfoResponse } from "@jellyfin/sdk/lib/generated-client/models";
import { getMediaInfoApi } from "@jellyfin/sdk/lib/utils/api";
import { Observable } from "@residualeffect/reactor";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { Receiver } from "Common/Receiver";
import BrowserDeviceProfile from "Device/BrowserDeviceProfile";
import { MediaPlayState } from "MediaPlayer/MediaPlayState";
import { MediaPlayerPlaylist } from "MediaPlayer/MediaPlayerPlaylist";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";

export class VideoPlayerService {
	constructor() {
		this.Fullscreen = new Observable(true);
		this.Playlist = new MediaPlayerPlaylist();
		this.PlaySessionId = (new Date().getTime() + 1).toString();
		this.State = new Observable(MediaPlayState.Stopped);
		this.PlaybackInfo = new Receiver("UnknownError");

		this.Playlist.Current.Subscribe((newItem) => {
			if (newItem === undefined) {
				this.Unload();
			} else {
				this.Load(newItem);
			}
		});
	}

	public ChangeProgress(newProgress: number): void {
		this.Video?.fastSeek(newProgress);
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.ClearAndPlay(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Video;
	}

	public Stop(): void {
		this.Video?.pause();
		this.Video?.fastSeek(0);
		this.Playlist.Stop();
	}

	public Pause(): void {
		this.Video?.pause();
		this.Playlist.Pause();
	}

	public Play(): void {
		this.Video?.play();
		this.Playlist.Play();
	}

	public Unload(): void {
		this.Video?.pause();
		this.Video?.fastSeek(0);
		this.Playlist.Stop();
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.None;
	}

	public SetVideoElement(video: HTMLVideoElement|null): void {
		Nullable.TryExecute(video, (videoElement) => {
			this.Video = videoElement;
			videoElement.addEventListener("play", () => { this.Playlist.Play(); });
			videoElement.addEventListener("timeupdate", () => { this.Playlist.CurrentProgress.Value = videoElement.currentTime; });
			videoElement.addEventListener("pause", () => { this.Playlist.Pause(); });
			videoElement.addEventListener("ended", () => { this.Playlist.Finished(); });
		});
	}

	private Load(item: MediaPlaylistItem): void {
		this.PlaybackInfo.Start((a) => getMediaInfoApi(ServerService.Instance.CurrentApi).getPostedPlaybackInfo({ itemId: item.Item.Id ?? "", userId: ServerService.Instance.CurrentUserId.Value, playbackInfoDto: { DeviceProfile: BrowserDeviceProfile() } }, { signal: a.signal }).then((r) => r.data));
	}

	public Playlist: MediaPlayerPlaylist;
	public PlaySessionId: string;
	public State: Observable<MediaPlayState>;
	public PlaybackInfo: Receiver<PlaybackInfoResponse>;
	public Fullscreen: Observable<boolean>;
	public Video: HTMLVideoElement|undefined;

	static get Instance(): VideoPlayerService {
		return this._instance ?? (this._instance = new VideoPlayerService());
	}

	private static _instance: VideoPlayerService;
}
