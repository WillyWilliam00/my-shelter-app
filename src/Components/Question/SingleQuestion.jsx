import { Button, Col } from "react-bootstrap";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
 
import ManageQuestion from "./ManageQuestion";

function SingleQuestion({ question, fetchQuestions }) {
    const token = localStorage.getItem('token')
    const { userData } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    // Conferma l'eliminazione
    if (!window.confirm("Sei sicuro di voler eliminare questa domanda?")) {
      return;
    }

      ; // Assicurati di avere un token valido
      const response = await fetch(`http://localhost:3030/questions/${question._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Assicurati che il token sia inviato correttamente
        },
      });
      setIsLoading(true); // Inizia il loading
      if (response.ok) {
        fetchQuestions()
        alert("Domanda eliminata!");
        setIsLoading(false); // Inizia il loading
      } else {
        console.error("Errore durante l'eliminazione della domanda:");
        setIsLoading(false); // Inizia il loading
      }

      
       
 
     
  };
   
  return (
    <Col xs={8} className="d-flex justify-content-between align-items-start">
      <div>
        <p>By: {question.createdBy.name}</p>
        <p>{question.question}</p>
        {!question.answer ? <p>Non ci sono ancora risposte</p> : <p>{question.answer}</p> }
      </div>
      {question.createdBy._id === userData._id && <>
      <Button variant="danger" type="button" onClick={handleDelete} disabled={isLoading}>
        {isLoading ? 'Eliminazione...' : 'X'}
      </Button>
      <ManageQuestion singleQuestion={question} fetchQuestions={fetchQuestions} /></>}
    </Col>
  );
}

export default SingleQuestion;
