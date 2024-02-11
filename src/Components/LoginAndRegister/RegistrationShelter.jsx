import { useEffect, useState } from "react";
import { Row, Col, Container, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import ServiceCheckbox from "../Utility/ServiceCheckbox";
import PhoneInput from "react-phone-number-input";
import GoogleMap from "../GoogleMap/GoogleMap";
import { Loader } from "@googlemaps/js-api-loader";


function ShelterRegistration() {

    const navigate = useNavigate("")
    const [markerPosition, setMarkerPosition] = useState(null)
    const [imageFile, setImageFile] = useState(new FormData());
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);
    const [shelterData, setShelterData] = useState({
        shelterName: '',
        description: '',
        altitude: '',
        coordinates: "",
        availableServices: {
            accommodation: false,
            toilets: false,
            accessibility: false,
            animalsAllowed: false,
            wifi: false,
            guidedTours: false,
            picnicArea: false,
            parking: false
        }
    });
    const [ownerData, setOwnerData] = useState({
        firstName: '',
        lastName: '',
        mail: '',
        phone: '',
        password: '',
    });
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

    //controlla se la password che si sta inserendo ha lettere maiuscole, caratteri speciali e ha + di 8 caratteri
    const checkPassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValid = password.length >= 8 && hasUpperCase && hasSpecialChar;
        setPasswordValid(isValid);;
    };
    //crea un nuovo utente rifugio
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://my-shelter-app-backend.onrender.com/shelter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...shelterData, owner: { ...ownerData } })
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 400 && data.message === "Questo rifugio esiste già!") {
                alert("Questo rifugio esiste già!")
                return;
            } else {
                throw new Error(data.message || 'Errore durante la registrazione');
            }
        } else {
            localStorage.setItem("token", data.token)
            //upload dell'immagine del rifugio
            const uploadImage = await fetch('https://my-shelter-app-backend.onrender.com/shelter/me/image',
                {
                    method: "PATCH",
                    body: imageFile,
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                })
            if (!uploadImage.ok) {
                alert("Errore nell'upload dell'immagine")
            } else {
                navigate("/");
            }
        }

    };
    // Gestisce il caricamento dell'immagine del rifugio
    const handleFile = (ev) => {
        setImageFile((prev) => {
            prev.delete("shelter-img");
            prev.append("shelter-img", ev.target.files[0]);
            return prev;
        });
    };

    //Gestiscono tutti i cambiamenti di stato 
    const handleShelterChange = (e) => {
        setShelterData({ ...shelterData, [e.target.name]: e.target.value });
    };
    const handleServiceChange = (service) => {
        setShelterData(prevData => ({
            ...prevData,
            availableServices: {
                ...prevData.availableServices,
                [service]: !prevData.availableServices[service]
            }
        }));
    };
    const handleOwnerChange = (e) => {
        setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
        if (e.target.name === 'password') {
            checkPassword(e.target.value);
        };
    };
    // Componente per la selezione dei servizi disponibili
    const availableServicesInfo = {
        accommodation: 'Si può dormire?',
        toilets: 'Ci sono i bagni?',
        accessibility: 'Accessibile per persone con disabilità?',
        animalsAllowed: 'Gli animali sono i benvenuti?',
        wifi: 'Wi-Fi Gratuito',
        guidedTours: 'Attività Guidate',
        picnicArea: 'Area Picnic',
        parking: 'Parcheggio disponibile'
    }

    return (
        isApiLoaded && <Container fluid>
            <Row>
                <Col xs={12} md={6} className="background-ShelterRegistration"></Col>
                <Col xs={12} md={6} className="loginBox m-0">
                    <h2 className="fw-bold mx-auto fitContent Loginh2">Hai un rifugio e vuoi farlo scoprire a tutti?</h2>
                    <p className="mx-auto fitContent mt-1">Compilati i campi e registrati a <strong>MyShelter!</strong></p>
                    <Form onSubmit={handleSubmit} className="Form">
                        <h5 className="fw-bold">Dati del Rifugio:</h5>
                        <Row>
                            <Col xs={8}><Form.Group controlId="shelterNameInput">
                                <Form.Label>Nome del tuo rifugio</Form.Label>
                                <Form.Control
                                    type="name"
                                    placeholder="Inserisci il nome del tuo rifugio"
                                    name="shelterName"
                                    required
                                    value={shelterData.shelterName}
                                    onChange={handleShelterChange}
                                />
                            </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group controlId="altitudeInput">
                                    <Form.Label>Altitudine del rifugio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="altitude"
                                        placeholder="Inserisci l'altitudine in metri"
                                        required
                                        value={shelterData.altitude}
                                        onChange={handleShelterChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="my-3">
                            <Col xs={12} xl={6} className="d-flex flex-column ">
                                <Form.Group controlId="formFile" className="mb-3" onChange={handleFile}>
                                    <Form.Label>Carica qui la foto del tuo rifugio:</Form.Label>
                                    <Form.Control type="file" required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Descrivi il tuo rifugio </Form.Label>
                                    <Form.Control as="textarea" rows={12} value={shelterData.description} onChange={handleShelterChange} required name="description" />
                                </Form.Group>

                            </Col>
                            <Col xs={12} xl={6}>{/* Mappa per selezionare la posizione del rifugio */}
                            <h5 className="fw-bold mt-2">Cercati sulla mappa!</h5>
                                <GoogleMap setShelterData={setShelterData} shelterData={shelterData} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition}></GoogleMap>
                            </Col>
                        </Row>

                        <h5 className="fw-bold">Seleziona i servizi disponibili presso il tuo rifugio:</h5>
                        <Row>
                            {Object.keys(availableServicesInfo).map((service) => (
                                <ServiceCheckbox
                                    key={service}
                                    service={service}
                                    label={availableServicesInfo[service]}
                                    imgSrc={`images/${service}.jpg`}
                                    onChange={() => handleServiceChange(service)}
                                    isChecked={shelterData.availableServices[service]}
                                    required
                                />
                            ))}
                        </Row>

                        <h5 className="fw-bold">Dati del proprietario:</h5>
                        <Row>
                            <Col>
                                <Form.Group controlId="nameInput">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="name"
                                        placeholder="Inserisci il tuo nome"
                                        name="firstName"
                                        required
                                        value={ownerData.firstName}
                                        onChange={handleOwnerChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="surnameInput">
                                    <Form.Label>Cognome</Form.Label>
                                    <Form.Control
                                        type="surname"
                                        placeholder="Inserisci il tuo cognome"
                                        name="lastName"
                                        required
                                        value={ownerData.lastName}
                                        onChange={handleOwnerChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col><Form.Group controlId="phoneInput">
                                <Form.Label>Numero di Telefono</Form.Label>
                                <PhoneInput
                                    placeholder="Cellulare"
                                    value={ownerData.phone}
                                    onChange={(phone) => setOwnerData({ ...ownerData, phone })}
                                    defaultCountry="IT"
                                    name="phone"

                                />
                            </Form.Group></Col>
                        </Row>
                        <Row>
                            <Col> <Form.Group controlId="emailInput">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Inserisci la tua email"
                                    name="mail"
                                    value={ownerData.mail}
                                    onChange={handleOwnerChange}
                                    required
                                />
                            </Form.Group></Col>
                            {!passwordValid && (
                            <Alert variant="danger">
                                La password deve essere lunga almeno 8 caratteri e contenere una lettera maiuscola e un carattere speciale.
                            </Alert>
                        )}
                            <Col xs={6}>
                                <Form.Group controlId="passwordInput">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Inserisci la tua password"
                                        name="password"
                                        required
                                        value={ownerData.password}
                                        onChange={handleOwnerChange}
                                    />
                                </Form.Group></Col>
                        </Row>
                        <Container>
                            <Row>
                                <Col xs={12} md={6} className="d-flex align-items-baseline justify-content-around mx-auto">
                                    <Button variant="primary" type="submit" className='mt-3 fs-4' disabled={!passwordValid || !markerPosition}>
                                        Registrati
                                    </Button>
                                    <Link to={"/signin-and-registration"} className=" fs-4 fw-bold mt-3">Sei già Iscritto?</Link>
                                </Col>
                            </Row>
                        </Container>

                    </Form>

                </Col>
            </Row>
        </Container>
    )
}

export default ShelterRegistration