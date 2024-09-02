import {useEffect, useMemo, useRef, useState} from "react";
import {SVGViewer} from '../SVGViewer';
import SvgTextLabel from "./SvgTextLabel";
import ScaleLoader from "react-spinners/ScaleLoader";
import {IRoom} from "../util";

interface SvgViewProps{
	rooms: IRoom[];
	showRoomNumbers: boolean;
	showRoomNames: boolean;
	floor: number;
	onElementClicked?: (id: string) => void;
	navigatedRoom: string | null;
	setViewer?: (viewer: SVGViewer) => void;
}

export default function SvgView({rooms, showRoomNumbers, showRoomNames, floor, onElementClicked, navigatedRoom, setViewer}: SvgViewProps) {
	
	const [lastSvgUpdate, setLastSvgUpdate] = useState(0);
	const [showLoader, setShowLoader] = useState(true);

	const planElement = useRef<HTMLDivElement>(null);
	const svgElement = useRef<SVGSVGElement | null>(null);
	const textContainerElement = useRef<SVGGElement>(null);

	useEffect(() => {
		fetch('plan.svg')
		  .then(res => res.text())
		  .then(res => {
			//setTimeout(() => {
				//res = res.replace(/<\?xml.*\?>/g, '');
				setLastSvgUpdate(Date.now());
				
				if(planElement.current) {
					planElement.current.innerHTML = res;
					svgElement.current = planElement.current.querySelector('svg');
				}
				if(svgElement.current) {
					const graph = new SVGViewer(svgElement.current);
					if(setViewer) setViewer(graph);
					if(textContainerElement.current) svgElement.current.appendChild(textContainerElement.current);
				}

				setShowLoader(false);
			//}, 2000);
		});
	}, []);

	useEffect(() => {
		//console.log('updating floor');
		const numberOfFloors = 3;
		if(!svgElement.current) return;

		for(let i = 0; i < numberOfFloors; i++){
			const layer = svgElement.current.querySelector(`#floor-${i}`) as SVGGElement;
			//if(layer) layer.style.display = (i === floor) ? 'inline' : 'none';
			if(layer) layer.style.visibility = (i === floor) ? 'visible' : 'hidden';

			svgElement.current.querySelectorAll<SVGTextElement>(`.layer-floor-${i}`).forEach(e => e.style.visibility = (i === floor) ? 'visible' : 'hidden')
		}

	}, [floor, lastSvgUpdate]);

	useEffect(() => {
		if(!svgElement.current) return;

		//first hide all navigation elements
		svgElement.current.querySelectorAll(`svg *`).forEach(e => e.classList.remove('navigated'));
		svgElement.current.querySelectorAll(`svg .nav`).forEach(e => (e as SVGPathElement).style.display = 'none');

		if(!navigatedRoom) return;

		//toggle room highlight
		const box = svgElement.current.querySelector(`#${navigatedRoom}`)// as SVGRectElement;
		box?.classList.add('navigated');

		//toggle navigation path (IRoom.nav is an array of elements ids, which are going to be made visible)
		rooms.find(r => r.id === navigatedRoom)?.nav.forEach(lineId => {
			if(!lineId) return;
			const line = svgElement.current!.querySelector(`#${lineId}`) as SVGPathElement;
			line.style.display = 'inline';
		});

	}, [rooms, navigatedRoom, lastSvgUpdate]);

	const textLabels = useMemo(() => {
		return rooms.map((room, i) => {
			if(!room.id) return undefined;
			const el = svgElement.current?.querySelector(`#${room.id}`);
			if(!el) return undefined;
			if(onElementClicked !== undefined) {
				//el.addEventListener('pointerup', () => onElementClicked(id));
				el.addEventListener('click', () => onElementClicked(room.id));
			}

			let floor = -1;
			for(let i = 0; i < 3; i++){
				if(el.matches(`#floor-${i} *`)) {
					floor = i;
					break;
				}
			}
			return <SvgTextLabel
				key={i}
				element={el as SVGPathElement}
				className={`layer-floor-${floor}`}
				roomName={(showRoomNames && room.showName) ? room.name : null}
				roomNumber={(showRoomNumbers && room.showNumber) ? room.number : null}
				xOffset={room.xOffset}
				yOffset={room.yOffset}
				fontSize={room.fontSize}
			/>
		});
	}, [rooms, showRoomNames, showRoomNumbers, onElementClicked, lastSvgUpdate]);

	return (
		<>
			<div /*dangerouslySetInnerHTML={{__html: svgTextContent}}*/ ref={planElement} className="plan"></div>
			<div className="loader" style={{display: showLoader ? 'flex' : 'none'}}>
				<ScaleLoader
					color='white'
					loading={showLoader}
				/>
				<span>Načítání mapy...</span>
			</div>
			<svg style={{display: 'none'}}>
				{/*this svg is just a dummy container for textContainerElement, which will be moved to the fetched svg*/}
				<g ref={textContainerElement}>
					{textLabels}
				</g>
			</svg>
		</>
	);
}


