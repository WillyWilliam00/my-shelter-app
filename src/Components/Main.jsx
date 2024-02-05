import { useContext, useEffect, useState } from "react"
import GoogleMap from "./GoogleMap/GoogleMap"
import AuthContext from "../context/AuthContext"
import { Col, Container, Row } from "react-bootstrap";
import ShelterCard from "./ShelterCard";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import haversineDistance from "haversine-distance";

function  Main() {

    const { userType, userData } = useContext(AuthContext)
    const [userCoordinates, setUserCoordinates] = useState()
    const [shelters, setShelters] = useState([]);
    const [sortedShelters, setSortedShelters] = useState([])

    const [isApiLoaded, setIsApiLoaded] = useState(false);
   
 
  useEffect(() => {
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
    
    useEffect(() => {
        if (userType === "user" && isApiLoaded && userData) {
               
            fetch("http://localhost:3030/shelter")
                .then(response => response.json())
                .then(data => setShelters(data))
                .catch(error => console.error("Error fetching shelter data:", error));
            const fullAddress = `${userData.address} ${userData.houseNumber} ${userData.country} ${userData.province} ${userData.zipCode}`
            geocodeByAddress(fullAddress)
                     .then(results => getLatLng(results[0]) )
                     .then(setUserCoordinates)
                     .catch(error => console.error('Geocode Error', error));          
        }

    }, [userType, userData, isApiLoaded]);

    useEffect(() => {
        if(userCoordinates && shelters){
             
             const sheltersWithDistance = shelters.map(shelter => ({
                 ...shelter,
                 distance: (haversineDistance(
                     { latitude: userCoordinates.lat, longitude: userCoordinates.lng },
                     { latitude: shelter.coordinates.lat, longitude: shelter.coordinates.lng }
                 )/1000).toFixed(2),
             }));

             setSortedShelters(sheltersWithDistance.sort((a, b) => a.distance - b.distance))
            
        }
    }, [userCoordinates, shelters])

    if (userType === "user") {
        return (
            <Container>
                <Row>
                <h3>Trova il rifugio più vicino a te:</h3>
                    <Col xs={12} lg={8}>
                            
                            {isApiLoaded && <GoogleMap shelters={shelters}/>}
                    </Col>
                    <Col xs={12} lg={4} style={{height: "80vh", overflow: "auto"}}>{
                        sortedShelters.map((shelter, i) => (
                            <ShelterCard shelter={shelter} key={i}/>
                        ))
                    }</Col>
                </Row>

            </Container>
                
             
        );
    } else if (userType === "shelter") {
        return (
            <>
                <h3>Modifica il tuo rifugio</h3>
            </>
        );
    }
}

export default Main