import { Button, Col } from "react-bootstrap"
import ReactStars from "react-stars"
import ManageReview from "./ManageReview";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

function SingleReview({ review, fetchReviews }) {
  const { tokenByLocalStorage } = useContext(AuthContext)
  const { userData } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => { //elimina la recensione corrente
    // Conferma l'eliminazione
    if (!window.confirm("Sei sicuro di voler eliminare questa domanda?")) {
      return;
    }
    const response = await fetch(`https://my-shelter-app-backend.onrender.com/reviews/${review._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenByLocalStorage}`,
      },
    });
    setIsLoading(true);
    if (response.ok) {
      fetchReviews()
      alert("Domanda eliminata!");
      setIsLoading(false);
    } else {
      console.error("Errore durante l'eliminazione della domanda:");
      setIsLoading(false);
    }

  }
  //ritorna la data in versione gg/mm/aaaa
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  return (
 
      <Col xs={8} className="mt-3 ms-2">
        {review.createdBy._id === userData._id &&
          <div className="d-flex align-items-center justify-content-between">
            <p className="fw-medium m-0">Ecco la tua Recensione:</p>
            <div>
            <Button variant="danger" type="button" onClick={handleDelete} disabled={isLoading} style={{ fontSize: 12 }}>
              {isLoading ? 'Eliminazione...' : 'X'}
            </Button>
            <ManageReview singleReview={review} fetchReviews={fetchReviews} />
            </div>
           
          </div>}
        <div className="mt-2" style={{ background: "lightgrey", borderRadius: 10, padding: 5 }}>
        <ReactStars
            count={5}
            edit={false}
            value={review.rating}
            size={20}
            activeColor="#ffd700"/>
          <p className="m-0">{review.comment}</p>
          <p className="fw-medium m-0" style={{ fontSize: 12 }}>By: <span style={{ color: "grey" }}>{review.createdBy.name}</span> {formatDate(review.date)}</p>
        </div>

      </Col>

  
  )
}

export default SingleReview