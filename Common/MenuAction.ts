export interface MenuAction {
	icon: JSX.Element,
	textKey: string;
	action: () => void;
}
