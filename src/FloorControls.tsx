import {getFloor} from "./util";


interface FloorControlsProps {
	floorSelected: number;
	onFloorChanged: (floor: number) => void;
	navigatedRoom: string | null;
}

export default function FloorControls({floorSelected, onFloorChanged, navigatedRoom}: FloorControlsProps) {


	const getButtonClasses = (floor: number) => {
		let classes = 'button button-secondary ';

		if(floorSelected === floor) classes += 'floor-selected ';
		if(navigatedRoom && getFloor(navigatedRoom) === floor) classes += 'floor-highlight';

		return classes;
	}

	const floor = getFloor(navigatedRoom ?? '');

	return (
		<div className="controls floor-controls left">
			<div>
				<button className={getButtonClasses(2)} onClick={() => onFloorChanged(2)}>2. patro</button>
				<button className={getButtonClasses(1)} onClick={() => onFloorChanged(1)}>1. patro</button>
				<button className={getButtonClasses(0)} onClick={() => onFloorChanged(0)}>Přízemí</button>
			</div>
			<div>
				{floor > 0 ?
				<svg className="floor-indicator" viewBox="0 0 4 12">
					<path d={`M 0 10 l 3 0 l 0 -${floor * 4} l -3 0`} className="nav" />
					<path d={`M 0.2 ${10 - 4 * floor} l 1 -1 m -1 1 l 1 1`}></path>
				</svg> : ''}
			</div>
		</div>
	);
}