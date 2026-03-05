import { BaseItemDto, PlaybackInfoResponse } from "@jellyfin/sdk/lib/generated-client/models";
import { getMediaInfoApi } from "@jellyfin/sdk/lib/utils/api";
import { Observable } from "@residualeffect/reactor";
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
		this.Fullscreen = new Observable(false);
		this.Playlist = new MediaPlayerPlaylist();
		this.PlaySessionId = (new Date().getTime() + 1).toString();
		this.State = new Observable(MediaPlayState.Stopped);
		this.PlaybackInfo = new Receiver("UnknownError");
		this.PlaySessionId = (new Date().getTime() + 1).toString();

		this.Playlist.Current.Subscribe((newItem) => {
			if (newItem === undefined) {
				this.Unload();
			} else {
				this.Load(newItem);
			}
		})
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.ClearAndPlay(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Video;
	}

	public Pause(): void {
		this.Video?.pause();
		this.State.Value = MediaPlayState.Paused;
	}

	public Play(): void {
		this.Video?.play();
		this.State.Value = MediaPlayState.Playing;
	}

	public Stop(): void {
		this.Video?.pause();
		this.Video?.fastSeek(0);
		this.State.Value = MediaPlayState.Stopped;
	}

	public Unload(): void {
		this.Stop();
	}

	public SetVideoElement(video: HTMLVideoElement|null): void {
		this.Video = video ?? undefined;
	}

	private Load(item: MediaPlaylistItem): void {
		this.PlaybackInfo.Start((a) => getMediaInfoApi(ServerService.Instance.CurrentApi).getPostedPlaybackInfo({ itemId: item.Item.Id ?? "", userId: ServerService.Instance.CurrentUserId.Value, playbackInfoDto: { DeviceProfile: BrowserDeviceProfile() } }, { signal: a.signal }).then((r) => r.data))
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
