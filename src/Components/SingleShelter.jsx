import { useCallback, useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { fromLatLng, setKey } from "react-geocode";
import Weather from "./Weather";
import QuestionShelter from "./Question/QuestionShelter";
import ManageQuestion from "./Question/ManageQuestion";
import ReviewShelter from "./Reviews/ReviewShelter";
import ManageReview from "./Reviews/ManageReview";
import ReactStars from "react-stars";

function SingleShelter() {
     
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const distance = queryParams.get("d");
    const [shelter, setShelter] = useState(null);
    const [questions, setQuestions] = useState(null)
    const [reviews, setReviews] = useState(null); 
    const [address, setAddress] = useState("");
    const token = localStorage.getItem('token');
    // Imposta la chiave API per Google Maps Geocoding API.
    setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
   
     

    const fetchReviews = useCallback(async () => {
        
            const reviewsResponse = await fetch(`http://localhost:3030/reviews/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData);
                 
            } else {
                console.error("Errore nel fetching delle recensioni:");
            }
        
    }, [id, token]) 

    const fetchQuestions = useCallback(async () => {

        const questionsResponse = await fetch(`http://localhost:3030/questions/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            setQuestions(questionsData);

        } else {
            console.error("Errore nel fetching delle domande:");
        }
    }, [id, token]);

    

    useEffect(() => {
        // Funzione asincrona per gestire la fetch e la geocodifica
        async function fetchShelterAndGeocode() {
            try {
                // Fetch delle informazioni del rifugio
                const response = await fetch(`http://localhost:3030/shelter/${id}`);
                const shelterData = await response.json();
                setShelter(shelterData)
                // Assicurati che le coordinate siano presenti prima di tentare la geocodifica
                if (shelterData.coordinates && shelterData.coordinates.lat && shelterData.coordinates.lng) {
                    // Geocodifica per ottenere l'indirizzo
                    const geocodeResponse = await fromLatLng(shelterData.coordinates.lat, shelterData.coordinates.lng);
                    const address = geocodeResponse.results[0].formatted_address;
                    setAddress(address); // Imposta l'indirizzo nello stato
                }
                fetchQuestions()
                fetchReviews()

            } catch (error) {
                console.error("Qualcosa non va", error);
            }
        }

        fetchShelterAndGeocode();


    }, [id, fetchQuestions, fetchReviews]);



    return (
        shelter && questions && reviews &&(
            <>
                <Container fluid>
                    <Row>
                        <Col xs={12} style={{ maxHeight: "30rem" }}>
                            <Image src={shelter.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-3" fluid>
                    <Row>
                        <Col xs={12} lg={8}>
                            <div className="d-flex justify-content-between">
                                <h3>{shelter.shelterName}</h3>
                                 <p>Distanza: {distance}km</p>
                                <p className="me-5">Proprietario: {shelter.owner.firstName}</p>
                            </div>
                            <p>{shelter.altitude}m s.l.m</p>
                            <p>{address}</p>
                            <p>{shelter.description}</p>
                        </Col>
                        <Col>
                            <Weather coordinates={shelter.coordinates} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <h4>Servizi Disponibili:</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}><h5>Domande: ({questions.length}): </h5></Col>
                        <Col xs={4}><ManageQuestion  fetchQuestions={fetchQuestions} id={id} /></Col>


                        {questions.length === 0 ? <p>Non ci sono ancora domande</p> : <QuestionShelter questions={questions} fetchQuestions={fetchQuestions} />}

                    </Row>
                    <Row>
                        <Col xs={4}><h5>Recensioni: ({reviews.length}) </h5> 
                        <div>
                        <ReactStars
                        count={5}
                        edit={false}
                        
                        size={24}
                        activeColor="#ffd700"
                    />
                            </div> </Col>
                        <Col xs={4}> <ManageReview fetchReviews={fetchReviews} id={id}/></Col>
                         {reviews.length === 0 ?  <p>Non ci sono ancora recensioni</p> : <ReviewShelter reviews={reviews} fetchReviews={fetchReviews} /> }  
                        
                    </Row>


                </Container>
            </>
        )
    );
}

export default SingleShelter;
