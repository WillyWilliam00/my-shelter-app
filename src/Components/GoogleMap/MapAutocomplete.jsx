import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

function MapAutocomplete({ setAddress, setCoordinates, address, setZoom, coordinates, setMarkerPosition, userData, setShelterData }) {
  
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll)
    setAddress(value);
    setCoordinates(ll);
    if(!userData){
       
      const newMarkerPosition = ll;
      // Aggiorna la posizione del marker con le nuove coordinate
      setMarkerPosition(newMarkerPosition)
      setShelterData(prevData => ({
        ...prevData,
        coordinates: {
            lat: newMarkerPosition.lat,
            lng: newMarkerPosition.lng
        }
    }))
    
    }

   
    // ... altri controlli per tipi di luogo ...
    
    if (results[0].types.includes("locality")) {
      setZoom(14)
    } else if (results[0].types.some(type => ["route", "premise", "street_address"].includes(type))) {
      setZoom(19); // Zoom per una via
    } else if(results[0].types.includes("administrative_area_level_1")){
      setZoom(8.5)
    }
  };

  // Il return statement deve essere qui
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
