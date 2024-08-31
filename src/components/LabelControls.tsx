import {useId, useState} from "react";
import {FiSettings} from "react-icons/fi";

interface LabelControlsProps {
	showNumbers: boolean;
	showNames: boolean;
	setShowNumbers: (val: boolean) => void;
	setShowNames: (val: boolean) => void;
}

export default function LabelControls({showNumbers, showNames, setShowNumbers, setShowNames}: LabelControlsProps) {

	const [showControls, setShowControls] = useState(false);

	const numbersCheckboxId = useId();
	const namesCheckboxId = useId();
	
	return (
		<>
			<div className={`controls right ${showControls ? 'shown' : 'hidden'}`}
				//@ts-expect-error
				inert={showControls ? undefined : ''}>
				<button className="control-close-button" onClick={() => setShowControls(false)}></button>
				<div>
					<label>
						<input type="checkbox" id={numbersCheckboxId} className="checkbox" checked={showNumbers} onChange={e => setShowNumbers(e.target.checked)} />
						Zobrazit čísla místností
					</label>
				</div>
				<div>
					<label>
						<input type="checkbox" id={namesCheckboxId} className="checkbox" checked={showNames} onChange={e => setShowNames(e.target.checked)} />
						Zobrazit názvy místností
					</label>
				</div>
			</div>
			<button className={`control-opener right ${showControls ? 'hidden' : 'shown'}`} onClick={() => setShowControls(true)}>
				<FiSettings size={'24px'} />
			</button>
		</>
	);
}