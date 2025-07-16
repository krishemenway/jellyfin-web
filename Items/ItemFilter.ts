import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Computed } from "@residualeffect/reactor";

export class ItemFilter {
	constructor(id: string, label: string) {
		this.Id = id;
		this.Label = label;

		this.Filters = [];
		this.SortBy = [];

		this.Items = new Computed(() => []);
	}

	public Id: string;
	public Label: string;

	public Filters: string[];
	public SortBy: string[];

	public Items: Computed<BaseItemDto[]>;
}
