import {APIProvider, AdvancedMarker, InfoWindow, Map, Pin } from '@vis.gl/react-google-maps';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';
import MapAutocomplete from './MapAutocomplete.jsx';
 

function GoogleMap({setShelterData, markerPosition, setMarkerPosition, shelters}) {
  const { userData } = useContext(AuthContext)
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  
 
  
  
      const [address, setAddress] = useState("")
      const [zoom, setZoom] = useState(6)
      const [coordinates, setCoordinates] = useState({
          lat: 43,
          lng: 12
      })
       
    
  
  const handleMapClick = (event) => {
    if(!userData){
      const newMarkerPosition = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng
      };
      // Aggiorna la posizione del marker con le nuove coordinate
      
      setMarkerPosition(newMarkerPosition);
      setShelterData(prevData => ({
          ...prevData,
          coordinates: {
              lat: newMarkerPosition.lat,
              lng: newMarkerPosition.lng
          }
      }))
       
    }
  };

  
  return (
    
 
    
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
       
        
          
          <div style={{height: "80vh", width: "100%"}}>
          <MapAutocomplete setShelterData={setShelterData} setAddress={setAddress} setCoordinates={setCoordinates} address={address} setZoom={setZoom} userData={userData} setMarkerPosition={setMarkerPosition} coordinates={coordinates}/>        
        <Map 
          zoom={zoom}
          center={coordinates}
          mapId={process.env.REACT_APP_GOOGLE_MAP_ID} 
          onClick={!userData && handleMapClick}
          mapTypeControl={false}
          streetViewControl={false}
                   
        >
          
          {!userData ? (
            <AdvancedMarker 
              position={markerPosition} 
            >
              <Pin background={"yellow"} borderColor={"green"} glyphColor={"blue"}/>
            </AdvancedMarker>
          ) : 
            shelters.map((shelter, index) => (
              <AdvancedMarker key={index} position={shelter.coordinates} onClick={() => setOpenInfoWindow(index)}>
                <Pin background={"yellow"} borderColor={"green"} glyphColor={"blue"}/>
                {openInfoWindow === index && <InfoWindow position={shelter.coordinates} onCloseClick={() => setOpenInfoWindow(null)}><Link to={`/${shelter._id}`}>{shelter.shelterName}</Link></InfoWindow>}
              </AdvancedMarker>
            ))
          }
        </Map>
         
      </div>
    </APIProvider> 
    
    

  );
}

export default GoogleMap;
