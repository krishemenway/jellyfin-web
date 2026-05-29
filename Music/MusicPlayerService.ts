import { BaseItemDto, BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { SortByNumber } from "Common/Sort";
import { ItemService } from "Items/ItemsService";
import { MediaPlayerService } from "MediaPlayer/MediaPlayerService";
import { MediaPlayerType } from "MediaPlayer/MediaPlayerType";
import { MediaPlaylistItem } from "MediaPlayer/MediaPlaylistItem";
import { ServerService } from "Servers/ServerService";
import { MediaPlayerPlaylist } from "MediaPlayer/MediaPlayerPlaylist";

export type MusicPlayerDropActionType = "MovePlaylistItem"|"AudioId"|"AlbumId-SongList"|"ArtistName-SongList"|"AudioId-SongList";

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

	public HandleDrop(dataTransfer: DataTransfer, afterIndex?: number): void {
		const addType = dataTransfer.getData("AddType") as MusicPlayerDropActionType;
		const addTypeId = dataTransfer.getData("AddTypeId");
		
		switch (addType) {
			case "MovePlaylistItem":
				this.Playlist.MovePlaylistItem(parseInt(addTypeId, 10), afterIndex);
				break;
			case "AudioId":
				this.AddItemsFromDataToPlaylist(dataTransfer, (item) => item.Id === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "ArtistName-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.Artists?.includes(addTypeId) ?? false, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "AlbumId-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.AlbumId === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
			case "AudioId-SongList":
				this.AddItemsFromListToPlaylist(dataTransfer, "Audio", (item) => item.Id === addTypeId, SortByNumber((i) => i.IndexNumber), afterIndex);
				break;
		}
	}

	public ClearAndPlay(items: BaseItemDto[]): void {
		this.Playlist.ClearAndPlay(items);
		MediaPlayerService.Instance.PlayerType.Value = MediaPlayerType.Music;
	}

	public Load(playlistItem: MediaPlaylistItem): void {
		this.Playlist.CurrentProgress.Value = 0;
		this.AudioElement.src = this.CreateAudioUrl(playlistItem.Item);
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
	}

	public ChangeProgress(newProgress: number): void {
		this.AudioElement.fastSeek(newProgress);
	}

	private AddItemsFromDataToPlaylist(dataTransfer: DataTransfer, filterItemsFunc: (item: BaseItemDto) => boolean, sortFunc: (a: BaseItemDto, b: BaseItemDto) => number, afterIndex?: number): void {
		Nullable.TryExecute(dataTransfer.getData("AddFromChildrenOfId"), (childrenOfId) => {
			const childrenToSearch = ItemService.Instance.FindOrCreateItemData(childrenOfId).Children;
			this.Playlist.AddRange((childrenToSearch.Data.Value.ReceivedData ?? []).filter(filterItemsFunc).sort(sortFunc), afterIndex);
		});
	}

	private AddItemsFromListToPlaylist(dataTransfer: DataTransfer, kind: BaseItemKind, filterItemsFunc: (item: BaseItemDto) => boolean, sortFunc: (a: BaseItemDto, b: BaseItemDto) => number, afterIndex?: number): void {
		Nullable.TryExecute(dataTransfer.getData("AddFromLibrary"), (libraryId) => {
			const childrenToSearch = ItemService.Instance.FindOrCreateItemList(libraryId, kind).List;
			this.Playlist.AddRange((childrenToSearch.Data.Value.ReceivedData?.List ?? []).filter(filterItemsFunc).sort(sortFunc), afterIndex);
		});
	}

	private OnTimeUpdate(evt: Event): void {
		this.Playlist.CurrentProgress.Value = (evt.currentTarget as HTMLAudioElement).currentTime;
	}

	private CreateAudioUrl(item: BaseItemDto): string {
		const api = ServerService.Instance.CurrentApi;

		const queryParams = new URLSearchParams({
			UserId: ServerService.Instance.CurrentUserId.Value,
			DeviceId: api.deviceInfo.id,
			MaxStreamingBitrate: "321754827",
			Container: "opus,webm|opus,ts|mp3,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg",
			TranscodingContainer: "mp4",
			TranscodingProtocol: "hls",
			AudioCodec: "aac",
			api_key: api.accessToken,
			PlaySessionId: this.Playlist.PlaySessionId,
			StartTimeTicks: "0",
			EnableRedirection: "true",
			EnableRemoteMedia: "false",
			EnableAudioVbrEncoding: "true"
		});

		return `${ServerService.Instance.CurrentApi.basePath}/Audio/${item.Id}/universal?${queryParams.toString()}`;
	}

	public Playlist: MediaPlayerPlaylist;

	private AudioElement: HTMLAudioElement;

	static get Instance(): MusicPlayerService {
		return this._instance ?? (this._instance = new MusicPlayerService());
	}

	private static _instance: MusicPlayerService;
}
