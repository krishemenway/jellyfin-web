import * as React from "react";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "node_modules/@jellyfin/sdk/lib/utils/api";
import { ServerService } from "Servers/ServerService";
import { Nullable } from "Common/MissingJavascriptFunctions";
import { TranslatedText } from "Common/TranslatedText";
import { useBackgroundStyles } from "AppStyles";
import { EditableItemProps } from "Items/EditableItemProps";

export const ChangeImageButton: React.FC<{ item: BaseItemDto; imageType: ImageType; onChanged: () => void; }&EditableItemProps> = ({ item, imageType, onChanged, isEditing }) => {
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

				getImageApi(ServerService.Instance.CurrentApi).setItemImage({ imageType: imageType, itemId: item.Id!, body: fileData as File|undefined }, { headers: { "Content-Type": contentType }}).then(() => onChanged());
			};

			reader.readAsDataURL(file);
		});
	};

	if (!isEditing) {
		return undefined;
	}

	return (
		<>
			<label className={background.button} htmlFor={`${item.Id}-${imageType}`} style={{ textAlign: "center", paddingTop: ".5rem", paddingBottom: ".5rem" }}>
				<TranslatedText textKey="ButtonChangeImage" />
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
