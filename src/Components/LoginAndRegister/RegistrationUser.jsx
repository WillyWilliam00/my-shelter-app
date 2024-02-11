import { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate("")
    const [passwordValid, setPasswordValid] = useState(true);
    const [formData, setFormData] = useState({ // Stato per memorizzare i dati inseriti nel form
        name: '',
        surname: '',
        mail: '',
        password: '',
        address: "",
        houseNumber: "",
        zipCode: "",
        province: "",
        country: ""
    });
    const checkPassword = (password) => {// Funzione per verificare i requisiti della password
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValid = password.length >= 8 && hasUpperCase && hasSpecialChar;
        setPasswordValid(isValid);
    };

    const handleSubmit = async (e) => { //iscrizione  nuovo utente type user
        e.preventDefault();
        const response = await fetch('https://my-shelter-app-backend.onrender.com/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 400 && data.message === "Questa mail esiste già!") {
                return alert("Questa mail esiste già")
            } else {
                throw new Error(data.message || 'Errore durante la registrazione');
            }
        } else {
            localStorage.setItem("token", data.token)
            navigate("/")
        }

    };
    const handleChange = (e) => {//gestisce i cambiamenti del form
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (e.target.name === 'password') {
            checkPassword(e.target.value);
        };
    }

    return (
        <Form onSubmit={handleSubmit} className="Form">
            <Row> <Col xs={6}>
                <Form.Group controlId="nameInput">
                    <Form.Label><strong>Nome</strong></Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Inserisci il tuo nome"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Col>
                <Col xs={6}><Form.Group controlId="surnameInput">
                    <Form.Label><strong>Cognome</strong></Form.Label>
                    <Form.Control
                        type="surname"
                        placeholder="Inserisci il tuo cognome"
                        name="surname"
                        required
                        value={formData.surname}
                        onChange={handleChange}
                    />
                </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={6}><Form.Group controlId="mailInput">
                    <Form.Label><strong>Email</strong></Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Inserisci la tua email"
                        name="mail"
                        value={formData.mail}
                        required
                        onChange={handleChange}
                    />
                </Form.Group></Col>
                <Col xs={6}><Form.Group controlId="passwordInput">
                    <Form.Label><strong>Password</strong></Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Inserisci la tua password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    
                </Form.Group></Col>
            </Row>
            <Row>
                <Col xs={8}><Form.Group controlId="addressInput">
                    <Form.Label><strong>Indirizzo</strong></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Inserisci qui il tuo indirizzo"
                        name="address"
                        required
                        onChange={handleChange} />
                </Form.Group></Col>
                <Col xs={4}><Form.Group controlId="HouseNumberInput">
                    <Form.Label><strong>N° civico</strong></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="10"
                        name="houseNumber"
                        required
                        onChange={handleChange} />
                </Form.Group></Col>
            </Row>
            <Row>
                <Col xs={8}> <Form.Group controlId="countryInput">
                    <Form.Label><strong>Località</strong></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Milano"
                        name="country"
                        required
                        onChange={handleChange} />
                </Form.Group></Col>
                <Col xs={2}><Form.Group controlId="zipCodeInput">
                    <Form.Label><strong>Cap</strong></Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="21010"
                        name="zipCode"
                        required
                        onChange={handleChange} />
                </Form.Group></Col>
                <Col xs={2}><Form.Group controlId="provinceInput">
                    <Form.Label><strong>Provincia</strong></Form.Label>
                    <Form.Control
                        maxLength={2}
                        type="text"
                        placeholder="MI"
                        name="province"
                        required
                        onChange={handleChange} />
                </Form.Group></Col>
            </Row>
          
            <Button variant="primary" type="submit" className='m-3 fs-5' disabled={!passwordValid}>
                Registrati
            </Button>
           
            
            {!passwordValid && (
                        <Alert variant="danger">
                            La password deve essere lunga almeno 8 caratteri e contenere una lettera maiuscola e un carattere speciale.
                        </Alert>
                    )}
            <Link to={"/registration-shelter"} className=" fs-4"><strong>Hai un rifugio?</strong></Link>
        </Form>
    )
}

export default Register