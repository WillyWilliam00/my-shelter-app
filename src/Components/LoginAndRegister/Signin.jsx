import { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";


function Signin() {
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext)


    const handleLogin = async (e) => {//gestisce il login dell'utente, sia shelter che user(in base a questo setta userData, userType)
        e.preventDefault()
        await login(mail, password)
    };
    return (
         
        <Form onSubmit={handleLogin} className="Form" >
            <Form.Group controlId="emailInput">
                <Form.Label><strong>Mail</strong></Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Inserisci la tua email"
                    name="email"
                    value={mail}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="passwordInput">
                <Form.Label><strong>Password</strong></Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Inserisci la tua password"
                    name="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit" className='m-2'>
                Login
            </Button>
        </Form>
        
    )
}



export default Signin