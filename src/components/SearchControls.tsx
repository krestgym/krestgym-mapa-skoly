import {useMemo, useState} from "react";
import {FaSearch} from "react-icons/fa";
import AsyncSelect from 'react-select/async'
import {IRoom, getTextContent} from "../util";


interface SearchControlsProps {
	rooms: IRoom[];
	onNavigate?: (id: string) => void;
	onCancelNavigation?: () => void;
	navigatedRoom: string | null;
}

export default function SearchControls({rooms, onNavigate, onCancelNavigation, navigatedRoom}: SearchControlsProps) {
	
	const [showControls, setShowControls] = useState(true);
	const [selectedRoom, setSelectedRoom] = useState('');

	const selectOptions = useMemo(() => {
		return rooms.filter(r => r.showName).map(r => {
			//include invisible extraInfo to be able to use it in search
			return {value: r.id, label: <>{r.name} <span style={{float: 'right'}}>{r.number}</span><span style={{display: 'none'}}>{r.extraInfo}</span></>}
		}).sort((a, b) => getTextContent(a.label).localeCompare(getTextContent(b.label)))
	}, [rooms]);

	//clean string for search comparison
	const strip = (str: string) => str.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

	return (
		<>
			<div className={`controls left search-controls ${showControls ? 'shown' : 'hidden'}`}
				//@ts-expect-error
				inert={showControls ? undefined : ''}>
				<button className="control-close-button" onClick={() => setShowControls(false)}></button>
				<div>Vyhledat učebnu/místnost:</div>
				<AsyncSelect
					defaultOptions={
						//hide irrelevant items from the search box when it's empty
						selectOptions.filter(i => rooms.find(r => r.id === i.value)?.showInSelect)
					}
					loadOptions={(input, callback) => {
						input = strip(input);
						callback(selectOptions.filter(i => strip(getTextContent(i.label)).includes(input)).sort((a, b) => {
							const aIndex = strip(getTextContent(a.label)).indexOf(input);
							const bIndex = strip(getTextContent(b.label)).indexOf(input);
							//1. sort by first occurrence of search string
							//2. sort by alphabetical order
							return aIndex === bIndex ?
								getTextContent(a.label).localeCompare(getTextContent(b.label)) :
								aIndex - bIndex
						}));
					}}
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
