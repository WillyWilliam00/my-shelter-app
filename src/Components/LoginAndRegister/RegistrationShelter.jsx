import { useState } from "react";
import { Row, Col, Container, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import ServiceCheckbox from "../Utility/ServiceCheckbox";
import PhoneInput from "react-phone-number-input";
import GoogleMap from "../GoogleMap/GoogleMap";

function ShelterRegistration(){


const navigate = useNavigate("")
const [markerPosition, setMarkerPosition] = useState(null)
const [imageFile, setImageFile] = useState(new FormData());



const handleFile = (ev) => {
      setImageFile((prev) => {
      prev.delete("shelter-img");
      prev.append("shelter-img", ev.target.files[0]);
      return prev;
    });
  };

const handleSubmit = async (e) => {
        e.preventDefault();
             const response = await fetch('http://localhost:3030/shelter', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({...shelterData, owner: {...ownerData}})
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
                const uploadImage = await fetch('http://localhost:3030/shelter/me/image',
                {
                    method: "PATCH",
                    body: imageFile,
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
                })
                if(!uploadImage.ok){
                    alert("Errore nell'upload dell'immagine")
                } else {
                    navigate("/");
                }
             }
     
    };

    const [shelterData, setShelterData] = useState({
        shelterName: '',
        description: '',
        altitude: '',
        coordinates: "",
        availableServices: {
            accommodation: false,
            toilets: false,
            accessibility: false,
            dogsAllowed: false
        }
    });
    
    const [ownerData, setOwnerData] = useState({
        firstName: '',
        lastName: '',
        mail: '',
        phone: '',
        password: '',
    });
   
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
    const [passwordValid, setPasswordValid] = useState(true);
      const checkPassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValid = password.length >= 8 && hasUpperCase && hasSpecialChar;
        setPasswordValid(isValid);;
    };
      const availableServicesInfo = {
        accommodation: 'Si può dormire?',
        toilets: 'Ci sono i bagni?',
        accessibility: 'Accessibile per persone con disabilità?',
        dogsAllowed: 'I cani sono i benvenuti?'
      };
    return(
        <Container fluid>
            <Row style={{height: "100vh"}}>
                <Col xs={12} md={6} className="background-ShelterRegistration"></Col>
                <Col xs={12} md={6} >
                    <h3>Hai un rifugio e vuoi farlo scoprire a tutti?</h3>
                    <p>Compilati i campi e registrati a MyShelter!</p>
                <Form onSubmit={handleSubmit}>
              <Form.Group controlId="shelterNameInput">
                <h3>Dati del Rifugio:</h3>
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
        <Form.Control as="textarea" rows={3} value={shelterData.description} onChange={handleShelterChange} required name="description"  />
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3" onChange={handleFile}>
        <Form.Label>Carica qui la foto del tuo rifugio:</Form.Label>
        <Form.Control type="file" required />
      </Form.Group>
            <h5>Seleziona i servizi disponibili presso il tuo rifugio:</h5>
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
      <h3>Dati del proprietario:</h3>
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
                <Col><Form.Group controlId="phoneInput">
                <Form.Label>Numero di Telefono</Form.Label>
        <PhoneInput
          placeholder="Inserisci il numero di telefono"
          value={ownerData.phone}
          onChange={(phone)=> setOwnerData({ ...ownerData, phone  }) }
          defaultCountry="IT" 
          name="phone"
        />
        </Form.Group></Col>
            </Row>
              <Row><Col xs={6}>
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
                            {!passwordValid && (
                    <Alert variant="danger">
                        La password deve essere lunga almeno 8 caratteri e contenere una lettera maiuscola e un carattere speciale.
                    </Alert>
                )}
        </Form.Group></Col></Row>
        <Container>
            <Row>
                <Col>
                
                <GoogleMap setShelterData={setShelterData} shelterData={shelterData} markerPosition={markerPosition} setMarkerPosition={setMarkerPosition}></GoogleMap>
                 
                </Col>
            </Row>
        </Container>
              
        
        <Button variant="primary" type="submit" className='mt-5' disabled={!passwordValid || !markerPosition}>
                            Registrati
        </Button>
         
        </Form>
        <Link to={"/signin-and-registration"}>Accedi!</Link>
                </Col>
            </Row>
        </Container>
    )
}

export default ShelterRegistration