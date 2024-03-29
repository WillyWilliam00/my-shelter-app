import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin } from '@vis.gl/react-google-maps';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';
import MapAutocomplete from './MapAutocomplete.jsx';

function GoogleMap({ setShelterData, markerPosition, setMarkerPosition, shelters }) {
  const { userData, userType } = useContext(AuthContext) // Accede ai dati dell'utente e al suo tipo dal contesto
  const [openInfoWindow, setOpenInfoWindow] = useState(null);
  const [address, setAddress] = useState("")
  const [zoom, setZoom] = useState(6)
  const [coordinates, setCoordinates] = useState({
    lat: 43,
    lng: 12
  })

  // Gestisce il click sulla mappa aggiungendo un marker nelle coordinate cliccate
  const handleMapClick = (event) => {

    const newMarkerPosition = {
      lat: event.detail.latLng.lat,
      lng: event.detail.latLng.lng
    }
    setMarkerPosition(newMarkerPosition);
    // Aggiorna i dati del rifugio con le nuove coordinate
    setShelterData(prevData => ({
      ...prevData,
      coordinates: {
        lat: newMarkerPosition.lat,
        lng: newMarkerPosition.lng
      }
    }))


  };

  return (

    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={(!userData || userType === "shelter") ? { height: "50vh" } : { height: "80vh", width: "100%" }}>
        {/* Autocomplete per la ricerca di indirizzi sulla mappa */}
        <MapAutocomplete setShelterData={setShelterData} setAddress={setAddress} setCoordinates={setCoordinates} address={address} setZoom={setZoom} setMarkerPosition={setMarkerPosition} coordinates={coordinates} />
        {/* Componente Map che visualizza la mappa */}
        <Map
          zoom={zoom}
          style={{ height: "90%" }}
          center={coordinates}
          mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
          onClick={(!userData || userType === "shelter") && handleMapClick}
          mapTypeControl={false}
          streetViewControl={false}>
          {/*-- se userData non è presente l'utente non è loggato
              -> se l'utente non è loggato e il type è shelter setta la mappa in modo che l'utente possa cambiare la posizione del marker
              -> altrimenti lista tutti i marker dei rifugi sulla mappa per l'utente type user*/}
          {!userData || userType === "shelter" ? (
            <AdvancedMarker
              position={markerPosition}
            >
              <Pin background={"green"} borderColor={"brown"} glyphColor={"brown"} />
            </AdvancedMarker>
          ) :
            shelters.map((shelter, index) => (
              <AdvancedMarker key={index} position={shelter.coordinates} onClick={() => setOpenInfoWindow(index)}>
                <Pin background={"green"} borderColor={"brown"} glyphColor={"brown"} />
                {openInfoWindow === index && <InfoWindow position={shelter.coordinates} onCloseClick={() => setOpenInfoWindow(null)}>
                  <Link to={`/${shelter._id}/?d=${shelter.distance}`} className='text-decoration-none'>
                    <div className='d-flex flex-column'>
                      <img src={shelter.image} style={{ width: "10rem" }} alt={shelter.shelterName} className='rounded'></img>
                      <div>
                        <p className='my-2 text-dark fs-6'>Nome: <span className='fw-bold'>{shelter.shelterName}</span></p>
                        <p className='my-1 text-dark fs-6'>Altitudine: <span className='fw-bold'>{shelter.altitude}m s.l.m</span></p>
                      </div>
                    </div>
                  </Link>
                </InfoWindow>}
              </AdvancedMarker>
            ))
          }
        </Map>
      </div>
    </APIProvider>
  )
}

export default GoogleMap;
