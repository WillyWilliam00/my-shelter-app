import { useCallback, useContext, useEffect, useState } from "react"
import GoogleMap from "./GoogleMap/GoogleMap"
import AuthContext from "../context/AuthContext"
import { Button, Col, Container, Row, Tab, Tabs, Form } from "react-bootstrap";
import ShelterCard from "./ShelterCard";
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import haversineDistance from "haversine-distance";
import ReactStars from "react-stars";


function Main() {

    const { userType, userData, tokenByLocalStorage } = useContext(AuthContext)
    const [userCoordinates, setUserCoordinates] = useState()
    const [shelters, setShelters] = useState([]);
    const [sortedShelters, setSortedShelters] = useState([])
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [visibleTextArea, setVisibleTextArea] = useState();
    const [answer, setAnswer] = useState()
    const [questions, setQuestions] = useState(null)
    const [reviews, setReviews] = useState(null);

    // Funzioni per gestire le risposte alle domande, caricamento recensioni e domande sui rifugi
    const handleAnswer = async (questionId, e) => {
        e.preventDefault();
        if (!answer.trim()) {
            alert("La risposta non può essere vuota o composta solo da spazi.");
            return; // Impedisce l'invio se la condizione è verificata
        }
        const response = await fetch(`https://my-shelter-app-backend.onrender.com/questions/update-answer/${questionId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenByLocalStorage}`
            },
            method: "PATCH",
            body: JSON.stringify({ answer: answer }),
        });
        if (response.ok) {
            fetchQuestions();
            alert("Operazione eseguita con successo!");
            setAnswer("");
            setVisibleTextArea(null)
        } else {
            alert("Si è verificato un errore.");
        }
    }

    const fetchReviews = useCallback(async () => {
        const reviewsResponse = await fetch(`https://my-shelter-app-backend.onrender.com/reviews/${userData?._id}`, {
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

    }, [userData?._id, tokenByLocalStorage])


    const fetchQuestions = useCallback(async () => {
        const questionsResponse = await fetch(`https://my-shelter-app-backend.onrender.com/questions/${userData?._id}`, {
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
    }, [userData?._id, tokenByLocalStorage]);

    //in base al type restuisco dati differenti
    // type === user -> restituisco la lista dei rifugi e setto la posizione dell'utente sotto forma di coordinate
    // type === shelter -> restituisco la lista delle recensioni e delle domande del proprio rifugio
    useEffect(() => {
        if (userData && userType === "user") {
            fetch("https://my-shelter-app-backend.onrender.com/shelter")
                .then(response => response.json())
                .then(data => setShelters(data))
                .catch(error => console.error("Error fetching shelter data:", error));
            const fullAddress = `${userData.address} ${userData.houseNumber} ${userData.country} ${userData.province} ${userData.zipCode}`
            geocodeByAddress(fullAddress)
                .then(results => getLatLng(results[0]))
                .then(setUserCoordinates)
                .catch(error => console.error('Geocode Error', error))
        } else if (userData && userType === "shelter") {
            fetchReviews()
            fetchQuestions()
        }
    }, [userType, userData, fetchQuestions, fetchReviews]);

    //useEffect per sapere quando l'API di google è caricata 
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

    //calcolo media dei punteggi delle recensioni
    const averageCalculation = (reviews) => {
        const average = reviews.reduce((acc, review) => acc + review.rating, 0,) / reviews.length
        if (average % 1 === 0) {
            return average
        } else {
            return average.toFixed(1)
        }
    }
    //ritorna la data in versione gg/mm/aaaa
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };

// se il type è user e le seu coordinate sono presenti inserisci nella lista dei rifugi il valore distanza, calcolato tramite haversineDistance
// ordina i rifugi dal meno distante al piu distante
    useEffect(() => {
        if (userType === "user" && userCoordinates) {
            const sheltersWithDistance = shelters.map(shelter => ({
                ...shelter,
                distance: (haversineDistance(
                    { latitude: userCoordinates.lat, longitude: userCoordinates.lng },
                    { latitude: shelter.coordinates.lat, longitude: shelter.coordinates.lng }
                ) / 1000).toFixed(2),
            }));
            setSortedShelters(sheltersWithDistance.sort((a, b) => a.distance - b.distance))
        }
    }, [userCoordinates, shelters, userType])
// in base al type restituisce uno o l'altra interfaccia
    if (userType === "user") {
        return (
            <Container>
                <Row>
                    <h3>Trova il rifugio più vicino a te:</h3>
                    <Col xs={12} lg={8}>

                        {isApiLoaded && <GoogleMap shelters={shelters} />}
                    </Col>
                    <Col xs={12} lg={4} style={{ height: "80vh", overflow: "auto" }}>{
                        sortedShelters.map((shelter, i) => (
                            <ShelterCard shelter={shelter} key={i} />
                        ))
                    }</Col>
                </Row>

            </Container>
        );
    } else if (userType === "shelter" && questions && reviews) {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h3>Domande:</h3>
                        <p>Qui sono racchiuse tutte le domande che gli utenti ti hanno fatto:</p>
                        <Tabs defaultActiveKey="allQuestions" id="uncontrolled-tab-example" className="mb-3">
                            <Tab eventKey="allQuestions" title={`Tutte le domande: (${questions.length})`}>
                                {questions.map((question, i) => (
                                    <div key={i}>
                                        <p>Domanda: {question.question}</p>
                                        <p>Fatta da: {question.createdBy.name}</p>
                                        {question.answer === "" ? <p>Non hai ancora risposto</p> :
                                            <><p>{question.answer}</p>
                                                {visibleTextArea !== question._id ? (
                                                    <Button onClick={() => { setVisibleTextArea(question._id); setAnswer(question.answer) }} type="button">Modifica Risposta</Button>
                                                ) : (
                                                    <Form onSubmit={(e) => handleAnswer(question._id, e)}>
                                                        <Form.Group className="mb-3" controlId="answer" required>
                                                            <Form.Label>Modifica risposta:</Form.Label>
                                                            <Form.Control as="textarea" rows={3} name="answer" value={answer} onChange={(e) => { setAnswer(e.target.value) }} required />
                                                        </Form.Group>
                                                        <Button variant="primary" type="submit">Invia Risposta</Button>
                                                    </Form>
                                                )}</>}
                                        <p>Data: {formatDate(question.date)}</p>
                                    </div>
                                ))}
                            </Tab>
                            <Tab eventKey="unansweredQuestions" title={`Domande senza risposta: (${questions.filter(question => question.answer === "").length})`}>
                                {questions.filter(question => question.answer === "").map((question, i) => (
                                    <div key={i}>
                                        <p>Domanda: {question.question}</p>
                                        <p>Fatta da: {question.createdBy.name}</p>
                                        <p>Data: {formatDate(question.date)}</p>
                                        {visibleTextArea !== question._id ? (
                                            <Button onClick={() => { setVisibleTextArea(question._id) }} type="button">Rispondi</Button>
                                        ) : (
                                            <Form onSubmit={(e) => handleAnswer(question._id, e)}>
                                                <Form.Group className="mb-3" controlId="answer">
                                                    <Form.Label>Rispondi:</Form.Label>
                                                    <Form.Control as="textarea" rows={3} name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
                                                </Form.Group>
                                                <Button variant="primary" type="submit">Invia Risposta</Button>
                                            </Form>
                                        )}
                                    </div>

                                ))}
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3>Recensioni:</h3>
                        <p>Qui sono racchiuse tutte le recensioni sul tuo rifugio:</p>
                        <p>In questo momento hai {reviews.length} recensioni</p>
                        {reviews.length !== 0 && <p>La tua media è: {averageCalculation(reviews)}/5</p>}
                        <ReactStars
                            count={5}
                            edit={false}
                            value={averageCalculation(reviews)}
                            size={24}
                            activeColor="#ffd700"
                        />
                        {reviews.length === 0 ? <p>Non ci sono ancora recensioni 🙁</p> :
                            reviews.map((review, i) => (
                                <div key={i}>
                                    <p>{review.createdBy.name}</p>
                                    <ReactStars
                                        count={5}
                                        edit={false}
                                        value={review.rating}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                    <p>{review.comment}</p>
                                    <p>Recensito il {formatDate(review.date)}</p>
                                </div>
                            ))}
                    </Col>
                </Row>
            </Container>
        );

    }
}
export default Main