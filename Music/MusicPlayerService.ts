import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";
import { MediaPlayerPlaylist } from "MediaPlayer/MediaPlayerPlaylist";
import BrowserDeviceProfile from "Device/BrowserDeviceProfile";

export class MusicPlayerService {
	constructor() {
		this.AudioElement = new Audio();
		this.Playlist = new MediaPlayerPlaylist();

		this.AudioElement.addEventListener("timeupdate", (evt: Event) => this.OnTimeUpdate(evt));
		this.AudioElement.addEventListener("loadeddata", () => { this.Play(); });
		this.AudioElement.addEventListener("ended", () => { this.Playlist.Finished(); });

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
	}

	public Load(playlistItem: MediaPlaylistItem): void {
		this.Playlist.CurrentProgress.Value = 0;
		this.AudioElement.src = this.CreateAudioUrl(playlistItem.Item);
		MediaPlayerService.Instance.SetPlayer(MediaPlayerType.Music);
	}

	public Stop(): void {
		this.AudioElement.pause();
		this.AudioElement.fastSeek(0);
		this.Playlist.Stop();
	}

	public Pause(): void {
		this.AudioElement.pause();
		this.Playlist.Pause();
	}

	public Play(): void {
		this.AudioElement.play();
		this.Playlist.Play();
	}

	public Unload(): void {
		this.Stop();
		this.Playlist.Reset();
		MediaPlayerService.Instance.SetPlayer(MediaPlayerType.None);
	}

	public ChangeProgress(newProgress: number): void {
		this.AudioElement.fastSeek(newProgress);
	}

	private OnTimeUpdate(evt: Event): void {
		this.Playlist.CurrentProgress.Value = (evt.currentTarget as HTMLAudioElement).currentTime;
	}

	private CreateAudioUrl(item: BaseItemDto): string {
		const api = ServerService.Instance.CurrentApi;
		const url = 'Audio/' + item.Id + '/universal';
		const audioDeviceProfile = getAudioDeviceProfile();

		return api.getUri(url, {
			UserId: ServerService.Instance.CurrentUserId.Value,
			DeviceId: api.deviceInfo.id,
			MaxStreamingBitrate: audioDeviceProfile.maxAudioBitrate ?? 150000000,
			Container: audioDeviceProfile.directPlayContainers,
			TranscodingContainer: audioDeviceProfile.transcodingProfile.Container ?? null,
			TranscodingProtocol: audioDeviceProfile.transcodingProfile.Protocol ?? null,
			AudioCodec: audioDeviceProfile.transcodingProfile.AudioCodec,
			MaxAudioSampleRate: audioDeviceProfile.maxAudioSampleRate,
			MaxAudioBitDepth: audioDeviceProfile.maxAudioBitDepth,
			ApiKey: api.accessToken,
			PlaySessionId: this.Playlist.PlaySessionId,
			StartTimeTicks: 0,
			EnableRedirection: true,
			EnableRemoteMedia: false,
			EnableAudioVbrEncoding: audioDeviceProfile.transcodingProfile.EnableAudioVbrEncoding
		});
	}

	public Playlist: MediaPlayerPlaylist;

	private AudioElement: HTMLAudioElement;

	static get Instance(): MusicPlayerService {
		return this._instance ?? (this._instance = new MusicPlayerService());
	}

	private static _instance: MusicPlayerService;
}

function getAudioDeviceProfile() {
	const deviceProfile = BrowserDeviceProfile();

	let maxAudioSampleRate = null;
	let maxAudioBitDepth = null;
	let maxAudioBitrate = null;
	let directPlayContainers = "";

	(deviceProfile.CodecProfiles ?? []).forEach(codecProfile => {
		if (codecProfile.Type === 'Audio') {
			(codecProfile.Conditions || []).forEach(condition => {
				if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioBitDepth') {
					maxAudioBitDepth = condition.Value;
				} else if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioSampleRate') {
					maxAudioSampleRate = condition.Value;
				} else if (condition.Condition === 'LessThanEqual' && condition.Property === 'AudioBitrate') {
					maxAudioBitrate = condition.Value;
				}
			});
		}
	});

	(deviceProfile.DirectPlayProfiles ?? []).forEach(p => {
		if (p.Type === 'Audio') {
			if (directPlayContainers) {
				directPlayContainers += ',' + p.Container;
			} else {
				directPlayContainers = p.Container ?? "";
			}

			if (p.AudioCodec) {
				directPlayContainers += '|' + p.AudioCodec;
			}
		}
	});

	return {
		maxAudioSampleRate: maxAudioSampleRate,
		maxAudioBitDepth: maxAudioBitDepth,
		maxAudioBitrate: maxAudioBitrate,
		directPlayContainers: directPlayContainers,
		transcodingProfile: (deviceProfile.TranscodingProfiles ?? []).filter(function (p) {
			return p.Type === 'Audio' && p.Context === 'Streaming';
		})[0],
	};
}
