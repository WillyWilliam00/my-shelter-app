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
    const response = await fetch(`http://localhost:3030/reviews/${review._id}`, {
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
    <>
      <Col>
        <p>{review.createdBy.name}</p>
        <p>{formatDate(review.date)}</p>
        <div>
          <ReactStars
            count={5}
            edit={false}
            value={review.rating}
            size={24}
            activeColor="#ffd700"
          />
        </div>
        <p>{review.comment}</p></Col>
      {review.createdBy._id === userData._id && <>
        <Button variant="danger" type="button" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Eliminazione...' : 'X'}
        </Button>
        <ManageReview singleReview={review} fetchReviews={fetchReviews} /></>}
    </>
  )
}

export default SingleReview