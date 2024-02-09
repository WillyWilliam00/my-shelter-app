import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext"
import { Col, Container, Row, Form, Button } from "react-bootstrap"
import PhoneInput from "react-phone-number-input";
import ServiceCheckbox from "./Utility/ServiceCheckbox";
import GoogleMap from "./GoogleMap/GoogleMap";
import { Loader } from "@googlemaps/js-api-loader";



function EditShelter() {
    const { userData, tokenByLocalStorage, fetchData, userType } = useContext(AuthContext)
    const [isModified, setIsModified] = useState(false)
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [imageFile, setImageFile] = useState(new FormData());
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [shelterData, setShelterData] = useState({
        shelterName: userData.shelterName,
        description: userData.description,
        altitude: userData.altitude,
        coordinates: { lat: userData.coordinates.lat, lng: userData.coordinates.lng },
        availableServices: {
            accommodation: userData.availableServices.accommodation,
            toilets: userData.availableServices.toilets,
            accessibility: userData.availableServices.accessibility,
            animalsAllowed: userData.availableServices.animalsAllowed,
            wifi: userData.availableServices.wifi,
            guidedTours: userData.availableServices.guidedTours,
            picnicArea: userData.availableServices.picnicArea,
            parking: userData.availableServices.parking
        }
    });
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
    const [markerPosition, setMarkerPosition] = useState(shelterData.coordinates)
    const [ownerData, setOwnerData] = useState({
        firstName: userData.owner.firstName,
        lastName: userData.owner.lastName,
        mail: userData.owner.mail,
        phone: userData.owner.phone,
    });

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

    //Gestiscono tutti i cambiamenti di stato
    const handleOwnerChange = (e) => {
        setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
        setIsModified(true)
    };
    const handleShelterChange = (e) => {
        setShelterData({ ...shelterData, [e.target.name]: e.target.value });
        setIsModified(true)
    };
    const handleServiceChange = (service) => {
        setShelterData(prevData => ({
            ...prevData,
            availableServices: {
                ...prevData.availableServices,
                [service]: !prevData.availableServices[service]
            }
        }));
        setIsModified(true)
    };
    const handleFile = (ev) => {// Gestisce il caricamento dell'immagine del rifugio
        setImageFile((prev) => {
            setIsModified(true)
            prev.delete("shelter-img");
            prev.append("shelter-img", ev.target.files[0]);
            setIsFileSelected(true);
            return prev;
        });
    };

    const handleSubmit = async (e) => {//modifica il rifugio
        e.preventDefault()
        const response = await fetch('http://localhost:3030/shelter/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenByLocalStorage}`

            },
            body: JSON.stringify({ ...shelterData, owner: { ...ownerData } })
        });
        if (response.ok) {
            if (isFileSelected) {
                // Se l'immagine è stata modificata, procedi con l'upload
                const uploadImage = await fetch('http://localhost:3030/shelter/me/image', {
                    method: "PATCH",
                    body: imageFile,
                    headers: {
                        Authorization: `Bearer ${tokenByLocalStorage}`
                    }
                });
                if (!uploadImage.ok) {
                    alert("Errore nell'upload dell'immagine");
                } else {
                    fetchData(tokenByLocalStorage, userType)
                    alert("La tua immagine è stata modificata con successo!");
                }
            }
            fetchData(tokenByLocalStorage, userType)
            alert("Il tuo rifugio è stato modificato con successo!")

        } else {
            alert("oh oh qualcosa è andato storto!")
        }
        setIsModified(false)
    }

    return (
        <>
            <Container fluid>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={6}>
                            <h5>Modifica le informazioni del tuo rifugio:</h5>
                            <p>Qui puoi modificare tutto ciò che riguarda il tuo rifugio.</p>
                        </Col>
                        <Col xs={6}>
                            <Button variant="primary" type="submit" className='mt-5' disabled={!isModified}>
                                Aggiorna
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <h3>Dati del proprietario:</h3>
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
                        <Col><Form.Group controlId="phoneInput">
                            <Form.Label>Numero di Telefono</Form.Label>
                            <PhoneInput
                                placeholder="Inserisci il numero di telefono"
                                value={ownerData.phone}
                                onChange={(phone) => setOwnerData({ ...ownerData, phone })}
                                defaultCountry="IT"
                                name="phone"
                            />
                        </Form.Group></Col>
                    </Row>
                    <Row>
                        <h3>Dov'è il tuo rifugio?</h3>
                        <Col xs={5}>
                            {/*Carica il componente Map per la scelta del marker e della posizione in base alla mappa o indirizzo scritto*/}
                            {isApiLoaded && <GoogleMap setShelterData={setShelterData} shelterData={shelterData} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition}></GoogleMap>}
                        </Col>
                        <Col xs={7}> <h3>Dati del rifugio:</h3>
                            <p>Immagine attuale del rifugio:</p>
                            <img src={userData.image} style={{ width: "10rem" }} alt={userData.name} />
                            <Form.Group controlId="formFile" className="mb-3" onChange={handleFile}>
                                <Form.Label>Modifica la foto del tuo rifugio:</Form.Label>
                                <Form.Control type="file" />
                            </Form.Group>
                            <Form.Group controlId="shelterNameInput">
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
                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label>Descrivi il tuo rifugio </Form.Label>
                                <Form.Control as="textarea" rows={3} value={shelterData.description} onChange={handleShelterChange} required name="description" />
                            </Form.Group>
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
                </Form>
            </Container>
        </>
    )
}

export default EditShelter