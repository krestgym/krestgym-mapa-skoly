import {useEffect, useRef} from "react";

interface SvgTextLabelProps {
	element: SVGPathElement | SVGRectElement;
	roomNumber: string | null;
	roomName: string | null;
	xOffset: number;
	yOffset: number;
	fontSize: number;
	className?: string;
}

export default function SvgTextLabel({element, roomNumber, roomName, xOffset, yOffset, fontSize, className}: SvgTextLabelProps) {

	const textBox = useRef<SVGTextElement>(null);
	const textSubNumber = useRef<SVGTSpanElement>(null);
	const textSubName = useRef<SVGTSpanElement>(null);
	
	const roombox = element.getBBox();
	const posx = roombox.x + roombox.width / 2 + xOffset;
	const posy = roombox.y + roombox.height / 2 + yOffset;
	const maxWidth = roombox.width - 0.2;

	const textStyles: React.CSSProperties = {
		whiteSpace: 'collapse',
		userSelect: 'none',
		pointerEvents: 'none',
		fontSize: `${fontSize ? fontSize : 1}px`,
		textAnchor: 'middle',
		dominantBaseline: 'central',
	}

	useEffect(() => {
		const fontSizes = [0.75, 0.5, 0.3, 0.2];

		if(!textBox.current || fontSize) return;

		//this fits the text inside given box
		let i = 0;
		while(Math.max(textSubName.current?.getComputedTextLength() ?? 0, textSubNumber.current?.getComputedTextLength() ?? 0) > maxWidth && i < fontSizes.length) {
			textBox.current.style.fontSize = `${fontSizes[i]}px`;
			i++;
		}

	}, [textSubName, textSubNumber, fontSize, maxWidth]);

	return (
		<text x={posx} y={posy} style={textStyles} ref={textBox} className={className}>
			{roomNumber && roomName ?
				<>
					<tspan dy="-0.5em" x={posx} ref={textSubNumber}>{roomNumber}</tspan>
					<tspan dy="1em" x={posx} ref={textSubName}>{roomName}</tspan>
				</>
				:
				<tspan ref={textSubNumber}>{roomNumber ? roomNumber : roomName}</tspan>
			}
		</text>
	);
}