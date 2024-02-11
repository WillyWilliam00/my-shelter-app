import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import AuthContext from "../../context/AuthContext";

function ManageReview({ id, fetchReviews, singleReview }) {

    const { tokenByLocalStorage } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [text, setText] = useState(singleReview ? singleReview.comment : "");
    const [rating, setRating] = useState(singleReview ? singleReview.rating : 0)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (e) => { //modifica o aggiunge la recensione in base a dove è localizzato il componente
        e.preventDefault();
        const url = singleReview
            ? `https://my-shelter-app-backend.onrender.com/reviews/${singleReview._id}` // URL per la modifica
            : `https://my-shelter-app-backend.onrender.com/reviews/${id}`; // URL per l'aggiunta
        const method = singleReview ? "PUT" : 'POST';
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenByLocalStorage}`
            },
            method: method,
            body: JSON.stringify({ comment: text, rating: rating }),
        });

        if (response.ok) {
            fetchReviews();
            alert("Operazione eseguita con successo!");
            setText("");
            handleClose();
        } else {
            alert("Si è verificato un errore.");
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow} style={singleReview ? {fontSize: 12, marginLeft: 5, background: "darkgreen", border: "none"} :  { background: "darkgreen", border: "none"}}>
                {singleReview ? "Modifica✏️" : "Fai una recensione ✒️"}
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{singleReview ? "Modifica la tua recensione:" : "Pubblica la tua recensione:"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3 mt-2" controlId="review">
                            <ReactStars
                                count={5}
                                value={rating}
                                onChange={ratingChanged}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 mt-2" controlId="review">
                            <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} required name="review" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annulla
                        </Button>
                        <Button variant="primary" type="submit">
                            {singleReview ? "Salva Modifiche" : "Pubblica"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default ManageReview;
