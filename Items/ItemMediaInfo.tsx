import * as React from "react";
import { ItemsPerRow, Layout } from "Common/Layout";
import { BaseItemDto, MediaStreamType, VideoRange, MediaStream } from "@jellyfin/sdk/lib/generated-client/models";
import { ListOf } from "Common/ListOf";
import { TranslatedText, TranslationRequest } from "Common/TranslatedText";
import { Bytes, Nullable } from "Common/MissingJavascriptFunctions";
import { useBackgroundStyles } from "AppStyles";
import { Collapsible } from "Common/Collapsible";
import { Button } from "Common/Button";

export const ItemMediaInfo: React.FC<{ item: BaseItemDto; }> = ({ item }) => {
	const [open, setOpen] = React.useState(false);
	const background = useBackgroundStyles();

	if (!Nullable.HasValue(item.Container) || item.MediaSourceCount === 0) {
		return <></>;
	}

	return (
		<Layout direction="column" minWidth="100%">
			<Button type="button" label="MoreMediaInfo" onClick={() => setOpen(!open)} direction="row" fontSizeREM={1.5} py=".5em" px=".5em" gap=".5em" />

			<Collapsible open={open}>
				<Layout direction="column" className={background.panel} px=".5rem" py=".5rem">
					<ListOf
						direction="column"
						items={item.MediaSources ?? []}
						forEachItem={(mediaSource, index) => (
							<Layout key={index} direction="row" wrap width={{ itemsPerRow: 2 }} gap="1rem 2rem">
								<MediaInfoDataPoint fieldKey="MediaInfoPath" fieldValue={item.Path} width={{ itemsPerRow: 1, gap: "2rem" }} />
								<MediaInfoDataPoint fieldKey="MediaInfoSize" fieldValue={Bytes.ConvertSize(mediaSource.Size)} width={{ itemsPerRow: 2, gap: "2rem" }} />
								{(mediaSource.MediaStreams ?? [])?.map((stream, index) => <MediaStreamDataPoints stream={stream} key={index} />)}
							</Layout>
						)}
					/>
				</Layout>
			</Collapsible>
		</Layout>
	);
};

const MediaStreamDataPoints: React.FC<{ stream: MediaStream }> = ({ stream }) => {
	return (
		<>
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoCodec" fieldValue={stream.Codec} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoResolution" fieldValue={Nullable.Value(stream.Width, undefined, (w) => `${w}x${stream.Height}`)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoAspectRatio" fieldValue={stream.AspectRatio} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoBitrate" fieldValue={Bytes.ConvertRate(stream.BitRate)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoSampleRate" fieldValue={stream.SampleRate} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoBitDepth" fieldValue={stream.BitDepth} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoFramerate" fieldValue={stream.RealFrameRate} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoCodecTag" fieldValue={stream.CodecTag} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoAnamorphic" fieldValue={ToYesOrNo(stream.IsAnamorphic)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoChannels" fieldValue={stream.Channels} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoColorPrimaries" fieldValue={stream.ColorPrimaries} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoColorSpace" fieldValue={stream.ColorSpace} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoColorTransfer" fieldValue={stream.ColorTransfer} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoDefault" fieldValue={ToYesOrNo(stream.IsDefault)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoExternal" fieldValue={ToYesOrNo(stream.IsExternal)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoForced" fieldValue={ToYesOrNo(stream.IsForced)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoInterlaced" fieldValue={ToYesOrNo(stream.IsInterlaced)} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoLanguage" fieldValue={stream.Language} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoLayout" fieldValue={stream.ChannelLayout} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoLevel" fieldValue={stream.Level} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoPixelFormat" fieldValue={stream.PixelFormat} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoProfile" fieldValue={stream.Profile} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoRefFrames" fieldValue={stream.RefFrames} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoRotation" fieldValue={stream.Rotation} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} fieldKey="MediaInfoVideoRange" fieldValue={stream.VideoRange === VideoRange.Unknown ? undefined : stream.VideoRange} width={{ itemsPerRow: 2, gap: "2rem" }} />
			<MediaInfoDataPoint type={stream.Type} field="NAL" fieldValue={stream.NalLengthSize} width={{ itemsPerRow: 2, gap: "2rem" }} />
		</>
	);
};

const MediaInfoDataPoint: React.FC<{ field?: string, fieldKey?: string, fieldValue?: string|null|number|TranslationRequest; width: ItemsPerRow, type?: MediaStreamType }> = ({ field, fieldKey, fieldValue, width, type }) => {
	if (!Nullable.HasValue(fieldValue)) {
		return <></>;
	}

	const isTranslationRequest = typeof fieldValue !== "string" && typeof fieldValue !== "number";

	return (
		<Layout direction="row" width={width} gap="1rem" justifyContent="space-between">
			<Layout direction="row" gap=".5rem" fontColor="Secondary" fontSizeREM={.8} alignItems="center" justifyContent="center">
				{Nullable.Value(type, undefined, (t) => <TranslatedText textKey={t} />)}
				{Nullable.Value(field, undefined, (f) => ` ${f}`)}
				{Nullable.Value(fieldKey, undefined, (fk) => <>&nbsp;<TranslatedText textKey={fk} /></>)}
			</Layout>

			<Layout direction="row">
				{isTranslationRequest && <TranslatedText textKey={fieldValue.Key} textProps={fieldValue.KeyProps} />}
				{!isTranslationRequest && fieldValue}
			</Layout>
		</Layout>
	);
};

function ToYesOrNo(value: boolean|undefined|null): TranslationRequest|undefined {
	if (!Nullable.HasValue(value)) {
		return undefined;
	}

	return { Key: value? "Yes" : "No" };
}
