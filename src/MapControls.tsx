import {TbHome, TbZoomIn, TbZoomOut} from "react-icons/tb";
import {Graph} from "./graph";

interface MapControlsProps {
	graph: Graph;
}

export default function MapControls({graph}: MapControlsProps) {

	return (
		<div className="controls map-controls right">
			<button className="map-control" onClick={() => graph.resetZoom()}><TbHome size={'24px'} /></button>
			<button className="map-control" onClick={() => graph.zoomIn()}><TbZoomIn size={'24px'} /></button>
			<button className="map-control" onClick={() => graph.zoomOut()}><TbZoomOut size={'24px'} /></button>
		</div>
	);
}