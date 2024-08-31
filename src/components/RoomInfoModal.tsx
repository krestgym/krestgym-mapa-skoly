import {ReactNode, useEffect, useRef} from "react";
import {IRoom} from "../util";

interface RoomInfoModalProps {
	children?: ReactNode;
	show: boolean;
	room: IRoom | null;
	onClosed?: () => void;
}

export default function RoomInfoModal({children, show, room, onClosed}: RoomInfoModalProps) {
	
	const infoModal = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if(show) infoModal.current?.showModal();
		else infoModal.current?.close();
	}, [show]);

	useEffect(() => {
		if(onClosed) {
			const modal = infoModal.current;
			modal?.addEventListener('close', onClosed);
			return () => modal?.removeEventListener('close', onClosed);
		}
	}, [onClosed]);

	return (
		<dialog ref={infoModal} className="room-info-modal">
			<button className="control-close-button" onClick={onClosed}></button>
			<span>{room?.name}</span>
			<div>Kód místnosti: {room?.number}</div>
			<div dangerouslySetInnerHTML={{__html: room?.extraInfo ?? ''}}></div>
			<div style={{display: 'flex', justifyContent:'space-between'}}>
				{children}
				<button onClick={onClosed} className="button button-primary">Zavřít</button>
			</div>
		</dialog>
	);
}