import { useContext, useEffect, useState } from "react";
import { Button, Card, Col } from "react-bootstrap"
import { fromLatLng, setKey } from "react-geocode";
import { Link } from "react-router-dom";
import haversineDistance from "haversine-distance";
import FavoritesContext from "../context/favouriteContext";

function SingleFavoriteShelter({ favorite, userCoordinates }) {
    const [address, setAddress] = useState()
    const [favoriteShelterWithDistance, setFavoriteShelterWithDistance] = useState()
    const { removeFavorite } = useContext(FavoritesContext)
    setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

    useEffect(() => {//estrapola l'indirizzo del rifugio in base alle coordinate
        fromLatLng(favorite.coordinates.lat, favorite.coordinates.lng)
            .then((r) => setAddress(r.results[0].formatted_address))
            .catch(error => { console.error("Qualcosa non va", error); })
    }, [favorite.coordinates.lat, favorite.coordinates.lng])

    useEffect(() => {//se sono presenti le coordinate dell'utente inserisci la distanza all'interno dei dati dei rifugi preferiti
        if (userCoordinates) {
            setFavoriteShelterWithDistance(
                {
                    ...favorite,
                    distance: (haversineDistance(
                        { latitude: userCoordinates.lat, longitude: userCoordinates.lng },
                        { latitude: favorite.coordinates.lat, longitude: favorite.coordinates.lng }
                    ) / 1000).toFixed(2)
                }
            )
        }
    }, [userCoordinates, favorite])

    const DeleteFavoriteShelter = async () => {//elimina dai preferiti un determinato rifugio
        if (!window.confirm("Sei sicuro di voler eliminare questo rifugio?")) {
            return;
        }
        removeFavorite(favoriteShelterWithDistance._id)
    }


    return (
        favoriteShelterWithDistance && (<Col xs={8}>
            <Card>
                <Button variant="danger" type="button" onClick={DeleteFavoriteShelter}>Elimina</Button>
                <Link className='text-dark text-decoration-none' to={`/${favoriteShelterWithDistance._id}/?d=${favoriteShelterWithDistance.distance}`}>
                    <Card.Img variant="top" src={favoriteShelterWithDistance.image} style={{ height: "20em", objectFit: "cover" }} />
                    <Card.Title>Nome del rifugio: {favoriteShelterWithDistance.shelterName}</Card.Title>
                    <Card.Body>
                        <Card.Text>
                            Indirizzo: {address}
                            <br />
                            Altitudine: {favoriteShelterWithDistance.altitude} m s.l.m
                            <br />
                            Si trova a {favoriteShelterWithDistance.distance}km da te!
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>Proprietario: {favoriteShelterWithDistance.owner.firstName}</Card.Footer>
                </Link>
            </Card>


        </Col>)
    )
}

export default SingleFavoriteShelter