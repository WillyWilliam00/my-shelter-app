import { useContext } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import AuthContext from '../../context/AuthContext';

function MapAutocomplete({ setAddress, setCoordinates, address, setZoom, setMarkerPosition, setShelterData }) {
  
  const {userData, userType} = useContext(AuthContext)// Accede ai dati dell'utente e al suo tipo dal contesto

  // Gestisce la selezione di un indirizzo dalla lista degli indirizzi 
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value); // Ottiene i dettagli dell'indirizzo selezionato
    const ll = await getLatLng(results[0]); // Converte l'indirizzo in coordinate lat e long
    setAddress(value); // Aggiorna l'indirizzo selezionato
    setCoordinates(ll); // Aggiorna le coordinate
    
// Se l'utente non è loggato e il type è un rifugio, aggiorna anche la posizione del marker sulla mappa
    if(!userData || userType === "shelter"){
      const newMarkerPosition = ll;
      setMarkerPosition(newMarkerPosition)
      setShelterData(prevData => ({
        ...prevData,
        coordinates: {
            lat: newMarkerPosition.lat,
            lng: newMarkerPosition.lng
        }
    }))}
    // ... altri controlli per tipi di luogo ...
    
    if (results[0].types.includes("locality")) {
      setZoom(14)
    } else if (results[0].types.some(type => ["route", "premise", "street_address"].includes(type))) {
      setZoom(19); // Zoom per una via
    } else if(results[0].types.includes("administrative_area_level_1")){
      setZoom(8.5)
    }
  };

  
  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container" style={{position: "absolute", zIndex: 1}}>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, i) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              return (
                <div
                  {...getSuggestionItemProps(suggestion, { className })}
                  key={i}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default MapAutocomplete;
