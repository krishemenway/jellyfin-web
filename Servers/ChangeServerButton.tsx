import * as React from "react";
import { CenteredModal } from "Common/Modal";
import { Servers } from "Servers/Servers";
import { Button, ButtonProps } from "Common/Button";
import { ServerIcon } from "Servers/ServerIcon";
import { Nullable } from "Common/MissingJavascriptFunctions";

export const ChangeServerButton: React.FC<{ withoutIcon?: boolean; onOpened?: () => void }&Partial<ButtonProps>> = (props) => {
	const [changingServer, setChangingServer] = React.useState(false);

	return (
		<>
			<Button
				{...props}
				icon={props.withoutIcon === true ? <></> : <ServerIcon />} label="ButtonChangeServer"
				type="button" onClick={() => { Nullable.TryExecute(props.onOpened, (o) => o()); setChangingServer(true); }}
			/>

			<CenteredModal noPanel open={changingServer} onClosed={() => { setChangingServer(false); }}>
				<Servers open={changingServer} onClosed={() => { setChangingServer(false); }} />
			</CenteredModal>
		</>
	);
};
