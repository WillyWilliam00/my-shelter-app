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
        const reviewsResponse = await fetch(`https://my-shelter-app-backend.onrender.com/reviews/${id}`, {
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
        const questionsResponse = await fetch(`https://my-shelter-app-backend.onrender.com/questions/${id}`, {
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
                const response = await fetch(`https://my-shelter-app-backend.onrender.com/shelter/${id}`);
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
            return +average
        } else {
            return +average.toFixed(1)
        }
    }

    return (
        shelter && questions && reviews && (
            <>
                <Container fluid>
                    <Row>
                        <Col xs={12} style={{ maxHeight: "30rem" }} className="p-0">
                            <Image src={shelter.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-3" fluid>
                    <Row>
                        <Col xs={12} lg={8} className="px-4">
                            <div className="ShelterinfoBox">
                                <div className="d-flex align-items-baseline justify-content-between">
                                    <h6 className="fw-bold">Nome del rifugio: <span className="baseColor fw-bold">{shelter.shelterName}</span></h6>
                                    <p className="fs-6 fw-bold">Appartiene a: <span className="baseColor fw-bold">{shelter.owner.firstName}</span></p>
                                    <p className="fs-6 fw-bold">Contatti: <span className="baseColor fw-bold">{shelter.owner.mail}, {shelter.owner.phone}</span></p>
                                </div>
                                <p className="fs-6 m-0"><span className="fst-italic fw-bold">Distanza dalla tua abitazione:</span> {distance}km 🗺️</p>
                                <p className="fs-6 m-0"><span className="fst-italic fw-bold">Altitudine:</span> {shelter.altitude}m s.l.m 🏔️</p>
                                <p className="fs-6 m-0"><span className="fst-italic fw-bold">Si trova in:</span> {address} 🏠</p>
                            </div>
                            <div className="mt-2 descriptionInfoBox">
                                <h5 className="fw-bold">Parlando di noi..</h5>
                                <p >{shelter.description}</p>
                            </div>
                        </Col>
                        <Col className="wheaterInfoBox mx-2">
                            <Weather coordinates={shelter.coordinates} name={shelter.shelterName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <h5 className="fw-bold">Cosa possiamo offrirti in <span className="baseColor">{shelter.shelterName}</span>?</h5>
                            <div><AvailableServices services={shelter.availableServices} /></div>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col xs={6} className="ps-4"><h5 className="fw-bold">Domande: ({questions.length}): </h5></Col>
                        <Col xs={6}><ManageQuestion fetchQuestions={fetchQuestions} id={id} /></Col>
                    </Row>

                    {questions.length === 0 ? <p>Non ci sono ancora domande</p> : <QuestionShelter  questions={questions} fetchQuestions={fetchQuestions} />}

                    <Row className="mt-3" style={{height: "30vh", overflow: "auto", borderTop: "2px solid darkgreen"}}>
                        <Col xs={6} className="ps-4 d-flex align-items-center">
                            
                            <h5 className="fw-bold me-3 mt-3">Recensioni: ({reviews.length}) </h5>
                            {reviews.length !== 0 &&
                                    <div className="d-flex align-items-center mt-3">
                                    <ReactStars
                                        count={5}
                                        edit={false}
                                        value={averageCalculation(reviews)}
                                        size={20}
                                        activeColor="#ffd700"
                                    /><span className="fw-bold ms-2">{averageCalculation(reviews)}/5</span>
                                    </div>
                                }
                             
                        </Col>
                        <Col xs={6} className="mt-3">
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
