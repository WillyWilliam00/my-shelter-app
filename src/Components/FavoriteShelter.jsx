import { useContext, useEffect, useState } from "react"
import FavoritesContext from "../context/favouriteContext"
import { Button, Container, Row } from "react-bootstrap"
import SingleFavoriteShelter from "./SingleFavoriteShelter"
import AuthContext from "../context/AuthContext";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Loader } from "@googlemaps/js-api-loader";

function FavoriteShelters() {
  const { favorites, clearFavourite } = useContext(FavoritesContext)
  const { userData } = useContext(AuthContext)
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState()

  useEffect(() => {//useEffect per sapere quando l'API di google è caricata 
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    loader.importLibrary("places").then(() => {
      setIsApiLoaded(true);
    }).catch(error => {
      console.error("Error loading Google Maps API", error);

    });
  }, []);

  useEffect(() => { //se l'utente è loggato e l'api di google è caricata estrapola l'indirizzo e setta le coordinate dell'utente
    if (userData && isApiLoaded) {
      const fullAddress = `${userData.address} ${userData.houseNumber} ${userData.country} ${userData.province} ${userData.zipCode}`
      geocodeByAddress(fullAddress)
        .then(results => getLatLng(results[0]))
        .then(setUserCoordinates)
        .catch(error => console.error('Geocode Error', error));
    }
  }, [setUserCoordinates, userData, isApiLoaded])

  const DeleteAllFavorites = () => { //elimina tutti i preferiti
    if (!window.confirm("Sei sicuro di voler eliminare tutti tuoi preferiti?")) {
      return;
    }
    clearFavourite()
  }

  return (
    (<Container>
      {favorites.length > 0 ? <>
      <Row>
      <button className="deleteAll ms-auto mt-2" type="button" onClick={DeleteAllFavorites}>
          <span className="deleteAll__text">Elimina tutti</span>
          <span className="deleteAll__icon"><svg className="svg" height={512} viewBox="0 0 512 512" width={512} xmlns="http://www.w3.org/2000/svg"><title /><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} /><line style={{ stroke: '#fff', strokeLinecap: 'round', strokeMiterlimit: 10, strokeWidth: '32px' }} x1={80} x2={432} y1={112} y2={112} /><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} /><line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1={256} x2={256} y1={176} y2={400} /><line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1={184} x2={192} y1={176} y2={400} /><line style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '32px' }} x1={328} x2={320} y1={176} y2={400} /></svg></span>
        </button> 
      </Row>
      <Row>
        {favorites.map((favorite, i) => (
          
            <SingleFavoriteShelter key={i} favorite={favorite} userCoordinates={userCoordinates} />
          
        ))}
        </Row></> : <p>Non hai ancora preferiti!</p>}
    </Container>)
  )
}

export default FavoriteShelters