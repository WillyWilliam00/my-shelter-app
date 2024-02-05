import { Button, Col } from "react-bootstrap"
import ReactStars from "react-stars"
import ManageReview from "./ManageReview";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

function SingleReview({review, fetchReviews}){
    const token = localStorage.getItem('token')
    const { userData } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        // Conferma l'eliminazione
        if (!window.confirm("Sei sicuro di voler eliminare questa domanda?")) {
          return;
        }
    
          ; // Assicurati di avere un token valido
          const response = await fetch(`http://localhost:3030/reviews/${review._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`, // Assicurati che il token sia inviato correttamente
            },
          });
          setIsLoading(true); // Inizia il loading
          if (response.ok) {
            fetchReviews()
            alert("Domanda eliminata!");
            setIsLoading(false); // Inizia il loading
          } else {
            console.error("Errore durante l'eliminazione della domanda:");
            setIsLoading(false); // Inizia il loading
          }
    
          
           
     
         
      };
    return(
        <>
        <Col>
        <p>{review.createdBy.name}</p>
        <p>{review.date}</p>
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