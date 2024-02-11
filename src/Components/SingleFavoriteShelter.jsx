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
        favoriteShelterWithDistance && (<Col xs={12} xl={6} >
            <Card className="SingleShelter">
                <Link className='text-dark text-decoration-none' to={`/${favoriteShelterWithDistance._id}/?d=${favoriteShelterWithDistance.distance}`}>
                    <Card.Img variant="top" src={favoriteShelterWithDistance.image} style={{ height: "20em", objectFit: "cover"}} /> </Link>
                    <div className="d-flex align-items-center justify-content-between">
                    <Card.Title className="ps-1">Nome del rifugio: <span className="fw-bold">{favoriteShelterWithDistance.shelterName}</span></Card.Title>
                    <button className="delete mt-1" onClick={DeleteFavoriteShelter} >
                    <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                </button></div>
                    <Card.Body>
                        <Card.Text className="p-1">
                            Indirizzo: <strong>{address}</strong>    
                            <br className="m-1" />
                            Altitudine: <strong>{favoriteShelterWithDistance.altitude} m s.l.m</strong>
                            <br  className="m-1"/>
                            Distanza: <strong>{favoriteShelterWithDistance.distance}km da te!</strong> 
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>Proprietario: <strong>{favoriteShelterWithDistance.owner.firstName}</strong></Card.Footer>
               
            </Card>


        </Col>)
    )
}

export default SingleFavoriteShelter