import * as React from "react";
import * as ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { ObservableArray } from "@residualeffect/reactor";
import { useBackgroundStyles } from "./AppStyles";

const body = document.getElementsByTagName("body")[0];
const modalRoot = document.createElement('div');
body.appendChild(modalRoot);

let lastZIndex: number = 10;
const outsideModalClickHandlerEvents: ObservableArray<(evt: MouseEvent) => void> = new ObservableArray([]);
const escapeModalKeyHandlerEvents: ObservableArray<(evt: KeyboardEvent) => void> = new ObservableArray([]);
const closedFuncs: ObservableArray<() => void> = new ObservableArray([]);

type HorizontalAlignment = "left"|"right";
type VerticalAlignment = "top"|"bottom";

interface ModalAnchorAlignment {
	vertical: VerticalAlignment;
	horizontal: HorizontalAlignment;
}

interface ModalProps {
	open: boolean;
	className?: string;
	alternatePanel?: boolean;
	onClosed: () => void;
	children: React.ReactNode;
}

export const ResetModalOnLocationChange: React.FC = () => {
	React.useEffect(() => { ResetAllModals(); }, [useLocation()]);
	return <></>;
};

function ResetAllModals(): void {
	body.className = "";
	modalRoot.innerHTML = "";

	closedFuncs.Value.forEach((func) => {
		func();
	});

	closedFuncs.clear();
	
	outsideModalClickHandlerEvents.Value.forEach((handler) => {
		modalRoot.removeEventListener("click", handler);
		outsideModalClickHandlerEvents.remove(handler);
	});

	escapeModalKeyHandlerEvents.Value.forEach((handler) => {
		body.removeEventListener("keyup", handler);
		escapeModalKeyHandlerEvents.remove(handler);
	});
}

export const CenteredModal: React.FC<ModalProps> = (props) => {
	const [modalClasses, background] = [useStyles(), useBackgroundStyles()];
	const [element] = React.useState(document.createElement("div"));

	function outsideModalClickHandler(evt: MouseEvent) { { if (evt.target == modalRoot) { props.onClosed(); } } }
	function escapeModalKeyHandler(evt: KeyboardEvent) { { if (evt.key == "Escape") { props.onClosed(); } } }

	const portal = ReactDOM.createPortal(props.children, element);

	React.useEffect(() => {
		if (props.open) {
			modalRoot.appendChild(element);
			modalRoot.addEventListener("click", outsideModalClickHandler);
			body.addEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.push(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.push(escapeModalKeyHandler);
			closedFuncs.push(props.onClosed);
		} else {
			if (modalRoot.contains(element))
			{
				modalRoot.removeChild(element);
			}

			if (modalRoot.children.length === 0) {
				lastZIndex = 10;
			}

			modalRoot.removeEventListener("click", outsideModalClickHandler);
			body.removeEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.remove(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.remove(escapeModalKeyHandler);
			closedFuncs.remove(props.onClosed);
		}

		modalRoot.className = modalClasses.anchoredModalOverlay;
		element.className = `${modalClasses.centeredModal} ${props.alternatePanel ? background.alternatePanel : background.panel} ${props.className ?? ""}`;

		body.className = modalRoot.hasChildNodes() ? `${modalClasses.isOpen} ${modalClasses.darken}` : "";
	}, [ props.open ]);
	return portal;
}

export interface AnchoredModalProps extends ModalProps {
	anchorElement: HTMLElement|null;
	anchorAlignment: ModalAnchorAlignment;
}

export const AnchoredModal: React.FC<AnchoredModalProps> = (props) => {
	const [modalClasses, background] = [useStyles(), useBackgroundStyles()];
	const [element] = React.useState(document.createElement("div"));

	function outsideModalClickHandler(evt: MouseEvent) { { if (evt.target == modalRoot) { props.onClosed(); } } }
	function escapeModalKeyHandler(evt: KeyboardEvent) { { if (evt.key == "Escape") { props.onClosed(); } } }

	const portal = ReactDOM.createPortal(props.children, element);

	React.useEffect(() => {
		if (props.open) {
			modalRoot.appendChild(element);
			modalRoot.addEventListener("click", outsideModalClickHandler);
			body.addEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.push(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.push(escapeModalKeyHandler);
			closedFuncs.push(props.onClosed);
		} else {
			if (modalRoot.contains(element))
			{
				modalRoot.removeChild(element);
			}

			if (modalRoot.children.length === 0) {
				lastZIndex = 10;
			}

			modalRoot.removeEventListener("click", outsideModalClickHandler);
			body.removeEventListener("keyup", escapeModalKeyHandler);
			outsideModalClickHandlerEvents.remove(outsideModalClickHandler);
			escapeModalKeyHandlerEvents.remove(escapeModalKeyHandler);
			closedFuncs.remove(props.onClosed);
		}

		modalRoot.className = modalClasses.anchoredModalOverlay;
		element.className = `${modalClasses.anchoredModal} ${props.alternatePanel ? background.alternatePanel : background.panel} ${props.className ?? ""}`;
		element.style.zIndex = (++lastZIndex).toString();

		if (props.anchorElement !== null) {
			element.style.top = CalculateTopOffset(props.anchorElement, props.anchorAlignment.vertical) + "px";
			element.style.left = CalculateHorizontalOffset(props.anchorElement, props.anchorAlignment.horizontal) + "px";
		}

		body.className = modalRoot.hasChildNodes() ? modalClasses.isOpen : "";
	}, [ props.open ]);
	return portal;
};

function CalculateTopOffset(anchorElement: HTMLElement, alignment: VerticalAlignment): number {
	const boundingClientRect = anchorElement.getBoundingClientRect();
	return alignment === "bottom" ? boundingClientRect.bottom : boundingClientRect.top;
}

function CalculateHorizontalOffset(anchorElement: HTMLElement, alignment: HorizontalAlignment): number {
	const anchorRect = anchorElement.getBoundingClientRect();

	if (alignment == "left") {
		return anchorRect.left + anchorRect.width / 2;
	} else {
		return anchorRect.left + anchorRect.width / 2;
	}
}

const useStyles = createUseStyles({
	anchoredModalOverlay: {
		position: "fixed",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		display: "none",

		"$isOpen &": {
			display: "block",
		},
	},
	anchoredModal: {
		position: "absolute",
		display: "none",

		"$isOpen &": {
			display: "block",
		},
	},
	centeredModal: {
		position: "absolute",
		display: "none",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",

		"$isOpen &": {
			display: "block",
		},
	},
	darken: {
		background: "rgba(0,0,0,.75)",
	},
	isOpen: {
		overflow: "hidden",
		paddingRight: "17px",
	},
});
