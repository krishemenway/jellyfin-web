import { EditableField, IEditableField } from "Common/EditableField";
import { LibraryTypeOptionsDto, TypeOptions } from "@jellyfin/sdk/lib/generated-client/models";

export class EditableLibraryItemTypeOptions {
	constructor(typeOptionDto: LibraryTypeOptionsDto, allTypeOptions?: TypeOptions[]) {
		this.TypeOptionDto = typeOptionDto;
		const relevantTypeOption = (allTypeOptions ?? []).first((to) => to.Type === typeOptionDto.Type);

		this.Type = typeOptionDto.Type!;
		this.MetadataFetchers = new EditableField(`${this.Type}-MetadataFetchers`, relevantTypeOption?.MetadataFetchers ?? typeOptionDto.MetadataFetchers?.filter((f) => f.DefaultEnabled).map((l) => l.Name!) ?? []);
		this.MetadataFetcherOrder = new EditableField(`${this.Type}-MetadataFetcherOrder`, relevantTypeOption?.MetadataFetcherOrder ?? typeOptionDto.MetadataFetchers?.map((l) => l.Name!) ?? []);
		this.ImageFetchers = new EditableField(`${this.Type}-ImageFetchers`, relevantTypeOption?.ImageFetchers ?? typeOptionDto.ImageFetchers?.filter((f) => f.DefaultEnabled).map((l) => l.Name!) ?? []);
		this.ImageFetcherOrder = new EditableField(`${this.Type}-ImageFetcherOrder`, relevantTypeOption?.ImageFetcherOrder ?? typeOptionDto.ImageFetchers?.map((l) => l.Name!) ?? []);
	}

	public AllFields(): IEditableField[] {
		return [
			this.MetadataFetchers,
			this.MetadataFetcherOrder,
			this.ImageFetchers,
			this.ImageFetcherOrder,
		];
	}

	public CreateRequest(): TypeOptions {
		return {
			Type: this.Type,
			MetadataFetchers: this.MetadataFetchers.Current.Value,
			MetadataFetcherOrder: this.MetadataFetcherOrder.Current.Value,
			ImageFetchers: this.ImageFetchers.Current.Value,
			ImageFetcherOrder: this.ImageFetcherOrder.Current.Value,
		};
	}

	public TypeOptionDto: LibraryTypeOptionsDto;

	public Type: string;

	public MetadataFetchers: EditableField<string[]>;
	public MetadataFetcherOrder: EditableField<string[]>;

	public ImageFetchers: EditableField<string[]>;
	public ImageFetcherOrder: EditableField<string[]>;
}