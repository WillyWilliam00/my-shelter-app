import { useState } from "react";
import {Form, Button, Alert} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


function Register(){
    const navigate = useNavigate("")
    const [formData, setFormData] = useState({
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
    const [passwordValid, setPasswordValid] = useState(true);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (e.target.name === 'password') {
            checkPassword(e.target.value);
        };
    }
    const checkPassword = (password) => {
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValid = password.length >= 8 && hasUpperCase && hasSpecialChar;
        setPasswordValid(isValid);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
            const response = await fetch('http://localhost:3030/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {

                if (response.status === 400 && data.message === "Questa mail esiste già!") {
                     
                    alert("Questa mail esiste già")
                    
                    return;
                    
                } else {
                    throw new Error(data.message || 'Errore durante la registrazione');
                }
                 
            } else {
                localStorage.setItem("token", data.token)
                navigate("/")
                

           
                 
            }
     
    };
    
    return(
        <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nameInput">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Inserisci il tuo nome"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange} 
                            />
            </Form.Group>
              <Form.Group controlId="surnameInput">
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control
                                type="surname"
                                placeholder="Inserisci il tuo cognome"
                                name="surname"
                                required
                                value={formData.surname}
                                onChange={handleChange} 
                            />
        </Form.Group>
        <Form.Group controlId="mailInput">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Inserisci la tua email"
                                name="mail"
                                value={formData.mail}
                                required
                                onChange={handleChange} 
                            />
        </Form.Group>
        <Form.Group controlId="addressInput">
            <Form.Label>Inserisci l'indirizzo</Form.Label>
            <Form.Control
            type="text"
            placeholder="Inserisci qui il tuo indirizzo"
            name="address"
            required
            onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="HouseNumberInput">
            <Form.Label>N° civico</Form.Label>
            <Form.Control
            type="number"
            placeholder="10"
            name="houseNumber"
            required
            onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="zipCodeInput">
            <Form.Label>Inserisci il CAP</Form.Label>
            <Form.Control
            type="number"
            placeholder="21010"
            name="zipCode"
            required
            onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="countryInput">
            <Form.Label>Inserisci località</Form.Label>
            <Form.Control
            type="text"
            placeholder="Milano"
            name="country"
            required
            onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="provinceInput">
            <Form.Label>Inserisci provincia</Form.Label>
            <Form.Control
            maxLength={2}
            type="text"
            placeholder="MI"
            name="province"
            required
            onChange={handleChange}/>
        </Form.Group>
        <Form.Group controlId="passwordInput">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Inserisci la tua password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange} 
                            />
                            {!passwordValid && (
                    <Alert variant="danger">
                        La password deve essere lunga almeno 8 caratteri e contenere una lettera maiuscola e un carattere speciale.
                    </Alert>
                )}
        </Form.Group>
       
        <Button variant="primary" type="submit" className='m-auto' disabled={!passwordValid}>
                            Registrati
        </Button>
        <Link to={"/registration-shelter"}>Hai un rifugio?</Link> 
        </Form>
    )
}

export default Register