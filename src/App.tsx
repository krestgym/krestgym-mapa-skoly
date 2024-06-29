import {useCallback, useEffect, useState} from "react";
import {IRoom, parseBool} from "./util";
import SvgView from "./SvgView";
import RoomInfoModal from "./RoomInfoModal";
import LabelControls from "./LabelControls";
import SearchControls from "./SearchControls";
import FloorControls from "./FloorControls";
import MapControls from "./MapControls";
import {Graph} from "./graph";


export default function App() {

	const [graph, setGraph] = useState<Graph | null>(null);
	
	const [rooms, setRooms] = useState<IRoom[]>([]);

	const [showNumbers, setShowNumbers] = useState(false);
	const [showNames, setShowNames] = useState(true);
	const [floorSelected, setFloorSelected] = useState(0);

	const [showModal, setShowModal] = useState(false);
	const [currentRoom, setCurrentRoom] = useState<IRoom | null>(null);

	//stores room id
	const [navigatedRoom, setNavigatedRoom] = useState<string | null>(null);
	
	useEffect(() => {
		fetch('rooms.csv')
		  .then(res => res.text())
		  .then(res => {
			const parsedRooms: IRoom[] = [];
			res.split('\n').forEach(line => {
				const room = line.split(',');
				const parsedRoom = {
					id: room[0] ?? '',
					number: room[1] ?? '',
					name: room[2] ?? '',
					extraInfo: room[3] ?? '',
					showNumber: parseBool(room[4]),
					showName: parseBool(room[5]),
					xOffset: parseFloat(room[6]),
					yOffset: parseFloat(room[7]),
					fontSize: parseFloat(room[8]),
					nav: room[9]?.split(' ') ?? [],
				};
				if(isNaN(parsedRoom.xOffset)) parsedRoom.xOffset = 0;
				if(isNaN(parsedRoom.yOffset)) parsedRoom.yOffset = 0;
				if(isNaN(parsedRoom.fontSize)) parsedRoom.fontSize = 0;
				parsedRooms.push(parsedRoom);
			});
			  setRooms(parsedRooms);
		});
	}, []);

	const onRoomClicked = useCallback((id: string) => {
		const room = rooms.find(r => r.id === id);
		if(!room) return;
		setCurrentRoom(room);
		setShowModal(true);
	}, [rooms]);

	const onDialogNavigationStarted = () => {
		if(navigatedRoom === currentRoom?.id) setNavigatedRoom(null);
		else if(currentRoom) setNavigatedRoom(currentRoom.id);
		setShowModal(false);
	}

	return (
		<>
			<SvgView rooms={rooms} showRoomNumbers={showNumbers} showRoomNames={showNames} floor={floorSelected} onElementClicked={onRoomClicked} navigatedRoom={navigatedRoom} setGraph={setGraph} />
			<FloorControls floorSelected={floorSelected} onFloorChanged={setFloorSelected} navigatedRoom={navigatedRoom}/>
			<SearchControls rooms={rooms} onNavigate={id => setNavigatedRoom(id)} onCancelNavigation={() => setNavigatedRoom(null)} navigatedRoom={navigatedRoom}/>
			<LabelControls showNumbers={showNumbers} showNames={showNames} setShowNumbers={setShowNumbers} setShowNames={setShowNames} />
			{graph ? <MapControls graph={graph} /> : undefined }
			<RoomInfoModal show={showModal} room={currentRoom} onClosed={() => setShowModal(false)}>
				<button onClick={onDialogNavigationStarted} className="button button-secondary">{navigatedRoom === currentRoom?.id ? 'Zrušit navigaci' : 'Navigovat'}</button>
			</RoomInfoModal>
		</>
	);
}