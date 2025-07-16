import { Computed, Observable, ReadOnlyObservable } from "@residualeffect/reactor";

export enum LoadState {
	NotStarted,
	Loading,
	Received,
	Failed,
	Unloaded,
}

export interface ReceiverData<TReceivedData> {
	readonly ReceivedData: TReceivedData | null;
	readonly ErrorMessage: string;
	readonly State: LoadState;
}

/** Object used for managing the state and resulting consequences of a long-running task. */
export class Receiver<TReceivedData> {
	constructor(errorTextKey: string) {
		this.DefaultErrorTextKey = errorTextKey;

		this.Abort = new AbortController();
		this.WritableData = new Observable(Receiver.NotStarted);
		this.IsBusy = new Computed(() => this.WritableData.Value.State === LoadState.Loading);
	}

	/**
	 * Mark receiver as loading. When promise is provided, will set to the appropriate received or failed state when promise is resolved.
	 * @param promise Optional argument for easy integration with tasks ran within a promise.
	 * @returns This receiver. To help with creating Receiver and Starting in one line.
	 */
	public Start(promise?: (abort: AbortController) => Promise<TReceivedData>, skipLoading?: boolean): Receiver<TReceivedData> {
		if (this.IsBusy.Value) {
			return this;
		}

		this.Abort = new AbortController();

		if (this.ShouldSetLoadingState(skipLoading)) {
			this.WritableData.Value = Receiver.Loading;
		}

		if (promise !== undefined) {
			const id = ++this.LastPromiseId;
			promise(this.Abort)
				.then((value) => { this.WhenNotCanceled(id, () => this.Received(value)); }, (reason: Error) => { this.WhenNotCanceled(id, () => this.Failed(reason.message)); })
				.catch((reason: Error) => { this.WhenNotCanceled(id, () => this.Failed(reason.message)); });
		}

		return this;
	}

	/**
	 * Set received state with provided received data.
	 * @param data Received data.
	 */
	public Received(data: TReceivedData): void {
		this.SetWritableData({ ReceivedData: data, State: LoadState.Received, ErrorMessage: "" });
	}

	/**
	 * Set failed state with provided message.
	 * @param error The failure message why the request failed.
	 */
	public Failed(error?: string): void {
		this.SetWritableData({ ReceivedData: null, State: LoadState.Failed, ErrorMessage: error !== undefined && error.length > 0 ? error : this.DefaultErrorTextKey });
	}

	/**
	 * Reset back to unloaded state. Ensure unloadComponent is provided to <Loading /> component.
	 * Useful when wanting to free an especially large response object.
	 */
	public Reset(): void {
		this.Abort.abort();
		this.SetWritableData(Receiver.Unloaded);
	}

	public AbortWhenLoading(): void {
		if (this.IsBusy.Value) {
			this.Abort.abort();
		}
	}

	private WhenNotCanceled(id: number, action: () => void) {
		if (!this.IgnorePromises.includes(id)) {
			action();
		}
	}

	private SetWritableData(data: ReceiverData<TReceivedData>): void {
		this.IgnorePromises.push(this.LastPromiseId);
		this.WritableData.Value = data;
	}

	private ShouldSetLoadingState(skipLoading?: boolean): boolean {
		if (skipLoading) {
			return this.Data.Value.State !== LoadState.Received;
		}

		return true;
	}

	/** Access to receiver data including State, Error and ReceivedData */
	public get Data(): ReadOnlyObservable<ReceiverData<TReceivedData>> { return this.WritableData; }
	public IsBusy: Computed<boolean>;
	public DefaultErrorTextKey: string;

	private static NotStarted = { ReceivedData: null, State: LoadState.NotStarted, ErrorMessage: "" };
	private static Loading = { ReceivedData: null, State: LoadState.Loading, ErrorMessage: "" };
	private static Unloaded = { ReceivedData: null, State: LoadState.Unloaded, ErrorMessage: "" };

	private WritableData: Observable<ReceiverData<TReceivedData>>;
	private Abort: AbortController;

	private IgnorePromises: number[] = [];
	private LastPromiseId = 0;
}
