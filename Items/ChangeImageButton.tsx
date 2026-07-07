import * as React from "react";
import { BaseItemDto, ImageType, RemoteImageInfo } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi, getRemoteImageApi } from "@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { EditableItemProps } from "Items/EditableItemProps";
import { CenteredModal } from "Common/Modal";
import { Button } from "Common/Button";
import { Receiver } from "Common/Receiver";
import { LoadingIcon } from "CommonIcons/LoadingIcon";
import { LoadingErrorMessages } from "Common/LoadingErrorMessages";
import { Loading } from "Common/Loading";
import { ListOf } from "Common/ListOf";
import { Layout } from "Common/Layout";
import { ItemCacheResetService } from "Items/ItemCacheResetService";

const remoteImageResults = new Receiver<RemoteImageInfo[]>("UnknownError");
export const ChangeImageButton: React.FC<{ label: string; item: BaseItemDto; imageType: ImageType; onChanged: () => void; }&EditableItemProps> = ({ label, item, imageType, onChanged, isEditing }) => {
	const [modalIsOpen, setIsOpened] = React.useState(false);
	const resetChangeImage = () => {
		setIsOpened(false);
		remoteImageResults.Reset();
	};

	const selectRemoteInfo = (remoteInfo: RemoteImageInfo, onComplete: () => void) => {
		getRemoteImageApi(ServerService.Instance.CurrentApi).downloadRemoteImage({ itemId: item.Id!, type: imageType, imageUrl: remoteInfo.Url! }).then(() => { onComplete(); });
	};

	React.useEffect(() => {
		if (modalIsOpen) {
			remoteImageResults.Start((a) => getRemoteImageApi(ServerService.Instance.CurrentApi).getRemoteImages({ itemId: item.Id!, type: imageType }, { signal: a.signal }).then((r) => r.data.Images ?? []));
		}

		return () => remoteImageResults.ResetIfLoading();
	}, [modalIsOpen]);

	if (!isEditing) {
		return undefined;
	}

	return (
		<>
			<Button type="button" onClick={() => { setIsOpened(true); }} label={label} alignItems="center" justifyContent="center" py=".5em" px=".5em" />

			<CenteredModal open={modalIsOpen} onClosed={() => { setIsOpened(false)}}>
				<Layout direction="column" gap="2rem" py="1rem" px="1rem">
					<Layout direction="row" fontSizeREM={1.2}><TranslatedText textKey="ReplaceExistingImages" /></Layout>
					<Loading
						receivers={[remoteImageResults]}
						whenNotStarted={<LoadingIcon alignSelf="center" size="4em" />}
						whenLoading={<LoadingIcon alignSelf="center" size="4em" />}
						whenError={(errors) => <LoadingErrorMessages errorTextKeys={errors} />}
						whenReceived={(results) => {
							return (
								<ListOf
									items={results}
									direction="row" wrap gap="0 1rem"
									emptyListView={(
										<Layout direction="column">
											<TranslatedText textKey="NoSubtitleSearchResultsFound" />
										</Layout>
									)}
									forEachItem={(r) => (
										<Layout direction="column" key={r.Url} height="20rem" width={{ itemsPerRow: 2, gap: "1rem" }} justifyContent="space-between">
											<img src={r.Url!} width="100%" height="100%" style={{ objectFit: "contain" }} />
											<Button type="button" onClick={() => { selectRemoteInfo(r, () => { ItemCacheResetService.Instance.ResetItem(item); resetChangeImage(); onChanged(); }) }} px=".5em" py=".5em" justifyContent="center" label="Select" />
										</Layout>
									)}
								/>
							)	
						}}
					/>

					<Layout direction="column" gap=".5rem">
						<UploadImageButton item={item} imageType={imageType} onChanged={() => { ItemCacheResetService.Instance.ResetItem(item); resetChangeImage(); onChanged(); }} />
						<Button type="button" onClick={resetChangeImage} label="ButtonCancel" justifyContent="center" px=".5rem" py=".5rem" fontColor="Secondary" />
					</Layout>
				</Layout>
			</CenteredModal>
		</>
	);
};

export const UploadImageButton: React.FC<{ item: BaseItemDto; imageType: ImageType; onChanged: () => void; }> = ({ item, imageType, onChanged }) => {
	const background = useBackgroundStyles();
	const onChange = (fileList: FileList|null) => {
		Nullable.TryExecute(fileList, (files) => {
			const file = files.item(0) ?? undefined;

			if (file === undefined) {
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const fileData = e.target?.result?.toString().split(",")[1];
				const contentType = e.target?.result?.toString().split(",")[0].split(";")[0].replace("data:", "");

				getImageApi(ServerService.Instance.CurrentApi).setItemImageByIndex({ imageType: imageType, itemId: item.Id!, body: fileData as File|undefined, imageIndex: 0 }, { headers: { "Content-Type": contentType }}).then(() => onChanged());
			};

			reader.readAsDataURL(file);
		});
	};

	return (
		<>
			<label className={background.button} htmlFor={`${item.Id}-${imageType}`} style={{ textAlign: "center", paddingTop: ".5rem", paddingBottom: ".5rem" }}>
				<TranslatedText textKey="HeaderUploadImage" />
			</label>

			<input
				id={`${item.Id}-${imageType}`}
				type="file" accept="image/*"
				onChange={(evt) => { onChange(evt.target.files) }}
				style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
			/>
		</>
	);
};
