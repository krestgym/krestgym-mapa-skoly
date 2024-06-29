
export interface IRoom {
	id: string;
	number: string;
	name: string;
	extraInfo: string;
	showNumber: boolean;
	showName: boolean;
	xOffset: number;
	yOffset: number;
	fontSize: number;
	nav: string[];
}

export function parseBool(val: any) {
	if(typeof val === 'string') {
		val = val.trim().toLowerCase();
		if(val[0] === 't' || val[0] === 'y' || val[0] === 'a' || val === 'on') return true;
	}
	return false;
}

// Get floor from room id
export function getFloor(id: string) {
	const match = id.match(/room-[a-z]+(\d)-.*/);
	if(match) {
		const floor = parseInt(match[1]);
		if(!isNaN(floor)) return floor;
	}
	return -1;
}

// Get innerText from React Element
// https://stackoverflow.com/questions/63141123/get-text-content-from-react-element-stored-in-a-variable
export function getTextContent(elem: React.ReactElement | string): string {
	if(!elem) return '';
	if(typeof elem === 'string') return elem;
	const children = elem.props && elem.props.children;
	if(children instanceof Array) {
		return children.map(getTextContent).join('');
	}
	return getTextContent(children);
}