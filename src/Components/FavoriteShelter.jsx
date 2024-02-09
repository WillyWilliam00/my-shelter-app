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
      {favorites.length > 0 ? <><Button variant="danger" type="button" onClick={DeleteAllFavorites}>Elimina tutti i preferiti</Button>
        {favorites.map((favorite, i) => (
          <Row key={i}>
            <SingleFavoriteShelter key={i} favorite={favorite} userCoordinates={userCoordinates} />
          </Row>
        ))}</> : <p>Non hai ancora preferiti!</p>}
    </Container>)
  )
}

export default FavoriteShelters