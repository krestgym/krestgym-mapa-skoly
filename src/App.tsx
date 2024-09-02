import {useCallback, useEffect, useState} from "react";
import {IRoom, parseBool} from "./util";
import SvgView from "./components/SvgView";
import RoomInfoModal from "./components/RoomInfoModal";
import LabelControls from "./components/LabelControls";
import SearchControls from "./components/SearchControls";
import FloorControls from "./components/FloorControls";
import MapControls from "./components/MapControls";
import {SVGViewer} from "./SVGViewer";


export default function App() {

	const [viewer, setViewer] = useState<SVGViewer | null>(null);
	
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
			//setTimeout(() => {
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
						showInSelect: parseBool(room[6]),
						xOffset: parseFloat(room[7]),
						yOffset: parseFloat(room[8]),
						fontSize: parseFloat(room[9]),
						nav: room[10]?.split(' ') ?? [],
					};
					if(isNaN(parsedRoom.xOffset)) parsedRoom.xOffset = 0;
					if(isNaN(parsedRoom.yOffset)) parsedRoom.yOffset = 0;
					if(isNaN(parsedRoom.fontSize)) parsedRoom.fontSize = 0;
					parsedRooms.push(parsedRoom);
				});
				setRooms(parsedRooms);
			//}, 2000);
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
			<SvgView rooms={rooms} showRoomNumbers={showNumbers} showRoomNames={showNames} floor={floorSelected} onElementClicked={onRoomClicked} navigatedRoom={navigatedRoom} setViewer={setViewer} />
			<FloorControls floorSelected={floorSelected} onFloorChanged={setFloorSelected} navigatedRoom={navigatedRoom}/>
			<SearchControls rooms={rooms} onNavigate={id => setNavigatedRoom(id)} onCancelNavigation={() => setNavigatedRoom(null)} navigatedRoom={navigatedRoom}/>
			<LabelControls showNumbers={showNumbers} showNames={showNames} setShowNumbers={setShowNumbers} setShowNames={setShowNames} />
			{viewer ? <MapControls viewer={viewer} /> : undefined }
			<RoomInfoModal show={showModal} room={currentRoom} onClosed={() => setShowModal(false)}>
				<button onClick={onDialogNavigationStarted} className="button button-secondary">{navigatedRoom === currentRoom?.id ? 'Zrušit navigaci' : 'Navigovat'}</button>
			</RoomInfoModal>
		</>
	);
}