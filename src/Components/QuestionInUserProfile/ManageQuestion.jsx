import { useContext, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AuthContext from '../../context/AuthContext';

function ManageQuestion({ id, fetchQuestions, singleQuestion }) {

    const { tokenByLocalStorage } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [text, setText] = useState(singleQuestion ? singleQuestion.question : "");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {//aggiunge o modifica la domanda in base a dove è richiamato il componente
        e.preventDefault();
        const url = singleQuestion
            ? `https://my-shelter-app-backend.onrender.com/questions/update-question/${singleQuestion._id}` // URL per la modifica
            : `https://my-shelter-app-backend.onrender.com/questions/${id}`; // URL per l'aggiunta
        const method = singleQuestion ? 'PATCH' : 'POST';
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenByLocalStorage}`
            },
            method: method,
            body: JSON.stringify({ question: text }),
        });
        if (response.ok) {
            fetchQuestions();
            alert("Operazione eseguita con successo!");
            setText("");
            handleClose();
        } else {
            alert("Si è verificato un errore.");
        }
    };

    return (

       <>
            <Button variant="primary" onClick={handleShow} style={singleQuestion ? {fontSize: 12, marginLeft: 5, background: "darkgreen", border: "none"} :  { background: "darkgreen", border: "none"}}>
                {singleQuestion ? "Modifica ✏️" : "Fai una domanda ✒️"}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{singleQuestion ? "Modifica la tua domanda:" : "Pubblica la tua domanda:"}</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3 mt-2" controlId="question">
                            <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} required name="question" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annulla
                        </Button>
                        <Button variant="primary" type="submit">
                            {singleQuestion ? "Salva Modifiche" : "Pubblica"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        
            </>
    );
}

export default ManageQuestion;

