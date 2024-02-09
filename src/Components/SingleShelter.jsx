import { useCallback, useContext, useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { fromLatLng, setKey } from "react-geocode";
import Weather from "./Weather";
import QuestionShelter from "./QuestionInUserProfile/QuestionShelter";
import ManageQuestion from "./QuestionInUserProfile/ManageQuestion";
import ReviewShelter from "./ReviewsInUserProfile/ReviewShelter";
import ManageReview from "./ReviewsInUserProfile/ManageReview";
import ReactStars from "react-stars";
import AuthContext from "../context/AuthContext";
import AvailableServices from "./AvailableServices ";

function SingleShelter() {

    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const distance = queryParams.get("d");
    const [shelter, setShelter] = useState(null);
    const [questions, setQuestions] = useState(null)
    const [reviews, setReviews] = useState(null);
    const [address, setAddress] = useState("");
    const { tokenByLocalStorage } = useContext(AuthContext)
    // Imposta la chiave API per Google Maps Geocoding API.
    setKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
// Funzioni per caricamento recensioni e domande sui rifugi
    const fetchReviews = useCallback(async () => {
        const reviewsResponse = await fetch(`http://localhost:3030/reviews/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${tokenByLocalStorage}`
            }
        });
        if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
        } else {
            console.error("Errore nel fetching delle recensioni:");
        }
    }, [id, tokenByLocalStorage])


    const fetchQuestions = useCallback(async () => {
        const questionsResponse = await fetch(`http://localhost:3030/questions/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${tokenByLocalStorage}`
            }
        });
        if (questionsResponse.ok) {
            const questionsData = await questionsResponse.json();
            setQuestions(questionsData);

        } else {
            console.error("Errore nel fetching delle domande:");
        }
    }, [id, tokenByLocalStorage]);

    useEffect(() => { //recupera un determinato rifugio, setta l'indirizzo in base alle coordinate e recupera le recensioni e le domande
        async function fetchShelterAndGeocode() {
            try {
                const response = await fetch(`http://localhost:3030/shelter/${id}`);
                const shelterData = await response.json();
                setShelter(shelterData)
                if (shelterData.coordinates && shelterData.coordinates.lat && shelterData.coordinates.lng) {
                    const geocodeResponse = await fromLatLng(shelterData.coordinates.lat, shelterData.coordinates.lng);
                    const address = geocodeResponse.results[0].formatted_address;
                    setAddress(address)
                }
                fetchQuestions()
                fetchReviews()
            } catch (error) {
                console.error("Qualcosa non va", error);
            }
        }
        fetchShelterAndGeocode();
    }, [id, fetchQuestions, fetchReviews]);

    const averageCalculation = (reviews) => { //calcolo media recensioni
        const average = reviews.reduce((acc, review) => acc + review.rating, 0,) / reviews.length
        if (average % 1 === 0) {
            return average
        } else {
            return average.toFixed(1)
        }
    }

    return (
        shelter && questions && reviews && (
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
                        <Col xs={4}>
                            <h4>Servizi Disponibili:</h4>
                            <AvailableServices services={shelter.availableServices} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}><h5>Domande: ({questions.length}): </h5></Col>
                        <Col xs={4}><ManageQuestion fetchQuestions={fetchQuestions} id={id} /></Col>
                        {questions.length === 0 ? <p>Non ci sono ancora domande</p> : <QuestionShelter questions={questions} fetchQuestions={fetchQuestions} />}
                    </Row>
                    <Row>
                        <Col xs={4}><h5>Recensioni: ({reviews.length}) </h5>
                            {reviews.length !== 0 && <p>La media è: {averageCalculation(reviews)}/5</p>}
                            <ReactStars
                                count={5}
                                edit={false}
                                value={averageCalculation(reviews)}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </Col>
                        <Col xs={4}>
                            <ManageReview fetchReviews={fetchReviews} id={id} />
                        </Col>
                        {reviews.length === 0 ? <p>Non ci sono ancora recensioni</p> : <ReviewShelter reviews={reviews} fetchReviews={fetchReviews} />}
                    </Row>
                </Container>
            </>
        )
    );
}

export default SingleShelter;
