import {useState} from "react";
import {FaSearch} from "react-icons/fa";
import Select, {createFilter} from 'react-select'
import {IRoom, getTextContent} from "./util";


interface SearchControlsProps {
	rooms: IRoom[];
	onNavigate?: (id: string) => void;
	onCancelNavigation?: () => void;
	navigatedRoom: string | null;
}

export default function SearchControls({rooms, onNavigate, onCancelNavigation, navigatedRoom}: SearchControlsProps) {
	
	const [showControls, setShowControls] = useState(true);
	const [selectedRoom, setSelectedRoom] = useState('');

	return (
		<>
			<div className={`controls left search-controls ${showControls ? 'shown' : 'hidden'}`}
				//@ts-expect-error
				inert={showControls ? undefined : ''}>
				<button className="control-close-button" onClick={() => setShowControls(false)}></button>
				<div>Vyhledat učebnu/místnost:</div>
				<Select
					options={
						rooms.filter(r => r.showName).map(r => {
							return {value: r.id, label: <>{r.name} <span style={{float: 'right'}}>{r.number}</span></>}
						})
					}
					//filterOption={(option, input) => getTextContent(option.label).trim().toLocaleLowerCase().includes(input)}
					filterOption={createFilter({
						stringify: option => getTextContent(option.label)
					})}
					onChange={val => setSelectedRoom(val?.value ?? '')}
					placeholder="Vyberte učebnu"
					className="select"
					styles={{
						control: (baseStyles, state) => ({
							...baseStyles,
							borderWidth: 1,
							borderRadius: 5,
							borderColor: state.isFocused ? '#04446a' : 'grey',
							boxShadow: state.isFocused ? '0 0 0 2px #065c8e' : undefined,
							"&:hover": {
								borderColor: '#04446a',
								cursor: 'pointer',
								boxShadow: state.isFocused ? '0 0 0 2px #065c8e' : undefined,
							}
						}),
						option: (baseStyles, state) => ({
							...baseStyles,
							background: state.isSelected ? '#04446a' : state.isFocused ? '#065c8e40' : undefined,
							cursor: 'pointer'
						}),
					}}
				/>
				<div className="buttons">
					<button onClick={onCancelNavigation} className={`button button-${navigatedRoom ? 'primary' : 'secondary'}`}>Ukončit navigaci</button>
					<button onClick={() => {if(onNavigate) onNavigate(selectedRoom)}} className={`button button-${navigatedRoom ? 'secondary' : 'primary'}`}>Navigovat</button>
				</div>	
			</div>
			<button className={`control-opener left ${showControls ? 'hidden' : 'shown'}`} style={{top: 180}} onClick={() => setShowControls(true)}>
				<FaSearch size={'24px'} />
			</button>
		</>
	);
}
