import * as React from "react";
import { useObservable } from "@residualeffect/rereactor";
import { LoadState, Receiver, ReceiverData } from "Common/Receiver";
import { Nullable } from "Common/MissingJavascriptFunctions";

export interface BaseLoadingComponentProps {
	minimumTimeRequiredToRender?: number;

	whenLoading: JSX.Element,
	whenNotStarted: JSX.Element;

	whenError: (errors: string[]) => JSX.Element,
	whenUnloaded?: JSX.Element;

	determineLoadState?: () => LoadState;
}

/**
 * Used for subscribing to a receiver to check for it is busy. Good for disabling buttons.
 * @param receiver Receiver to observe for state changes.
 * @returns If the receiver is busy loading data.
 */
export function useIsBusy(receiver: Receiver<unknown>): boolean {
	return useObservable(receiver.IsBusy);
}

/**
 * Used for subscribing to a receiver to check for it is busy. Good for disabling buttons.
 * @param receiver Receiver to observe for state changes.
 * @returns If the receiver is busy loading data.
 */
export function useError(receiver: Receiver<unknown>): string|undefined {
	return useObservable(receiver.Data).ErrorMessage;
}

/**
 * Used for subscribing to a receiver to check for it is busy. Good for disabling buttons.
 * @param receiver Receiver to observe for state changes.
 * @returns If the receiver is busy loading data.
 */
export function useDataOrNull<T>(receiver: Receiver<T>): T|null {
	return useObservable(receiver.Data).ReceivedData;
}

function LoadingComponent<A>(props: { receivers: [Receiver<A>], whenReceived: (a: A) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;
function LoadingComponent<A, B>(props: { receivers: [Receiver<A>, Receiver<B>], whenReceived: (a: A, b: B) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;
function LoadingComponent<A, B, C>(props: { receivers: [Receiver<A>, Receiver<B>, Receiver<C>], whenReceived: (a: A, b: B, c: C) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;
function LoadingComponent<A, B, C, D>(props: { receivers: [Receiver<A>, Receiver<B>, Receiver<C>, Receiver<D>], whenReceived: (a: A, b: B, c: C, d: D) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;
function LoadingComponent<A, B, C, D, E>(props: { receivers: [Receiver<A>, Receiver<B>, Receiver<C>, Receiver<D>, Receiver<E>], whenReceived: (a: A, b: B, c: C, d: D, e: E) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;
function LoadingComponent<A, B, C, D, E, F>(props: { receivers: [Receiver<A>, Receiver<B>, Receiver<C>, Receiver<D>, Receiver<E>, Receiver<F>], whenReceived: (a: A, b: B, c: C, d: D, e: E, f: F) => JSX.Element } & BaseLoadingComponentProps): JSX.Element;

function LoadingComponent(props: { receivers: Receiver<unknown>[], whenReceived: (...inputValues: unknown[]) => JSX.Element, } & BaseLoadingComponentProps): JSX.Element {
	const [hasPassedThreshold, setHasPassedThreshold] = React.useState(false);
	const receiverData = props.receivers.map((r) => useObservable(r.Data));
	const receiveState = (props.determineLoadState ?? DetermineLoadState.Default)(receiverData);

	React.useLayoutEffect(() => {
		if (props.minimumTimeRequiredToRender === undefined || receiveState === LoadState.Failed || receiveState === LoadState.Received) {
			setHasPassedThreshold(true);
		} else if (receiveState === LoadState.Unloaded) {
			setHasPassedThreshold(false);
		} else if (receiveState === LoadState.Loading) {
			const newHandle = window.setTimeout(() => { setHasPassedThreshold(true); }, props.minimumTimeRequiredToRender)
			return () => window.clearTimeout(newHandle);
		}

		return () => undefined;
	}, [receiveState]);

	switch (receiveState) {
		case LoadState.Failed:
			return props.whenError(receiverData.map((data) => data.ErrorMessage).filter(message => Nullable.HasValue(message)));
		case LoadState.Received:
			return props.whenReceived(...receiverData.map((data) => data.ReceivedData));
		case LoadState.NotStarted:
			return hasPassedThreshold ? props.whenNotStarted : <></>;
		case LoadState.Unloaded:
			return props.whenUnloaded ?? props.whenNotStarted;
		case LoadState.Loading:
		default:
			return hasPassedThreshold ? props.whenLoading : <></>;
	}
}

export class DetermineLoadState {
	public static Default(receivers: ReceiverData<unknown>[]): LoadState {
		const countsByState = DetermineLoadState.FindCountsByState(receivers);
		return DetermineLoadState.DefaultPriorityOrder.find(((state) => countsByState[state] > 0)) ?? LoadState.NotStarted;
	}

	public static FindCountsByState(receivers: ReceiverData<unknown>[]): Record<string, number> {
		const counts: Record<string, number> = Object.keys(LoadState).reduce((receiveStateCount, state) => { receiveStateCount[state] = 0; return receiveStateCount; }, {} as Record<string, number>);
		return receivers.reduce((current, receiverData) => { current[receiverData.State]++; return current; }, counts);
	}

	public static DefaultPriorityOrder = [LoadState.Failed, LoadState.Loading, LoadState.NotStarted, LoadState.Unloaded, LoadState.Received];
}

export const Loading = LoadingComponent;
