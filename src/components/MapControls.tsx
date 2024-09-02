import {TbHome, TbZoomIn, TbZoomOut} from "react-icons/tb";
import {SVGViewer} from "../SVGViewer";

interface MapControlsProps {
	viewer: SVGViewer;
}

export default function MapControls({viewer}: MapControlsProps) {

	return (
		<div className="controls map-controls right">
			<button className="map-control" onClick={() => viewer.resetZoom()}><TbHome size={'24px'} /></button>
			<button className="map-control" onClick={() => viewer.zoomIn()}><TbZoomIn size={'24px'} /></button>
			<button className="map-control" onClick={() => viewer.zoomOut()}><TbZoomOut size={'24px'} /></button>
		</div>
	);
}