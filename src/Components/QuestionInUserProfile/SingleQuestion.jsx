import { Button, Col } from "react-bootstrap";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

import ManageQuestion from "./ManageQuestion";

function SingleQuestion({ question, fetchQuestions }) {
  const { tokenByLocalStorage } = useContext(AuthContext)
  const { userData } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => { //elimina la domanda corrente

    if (!window.confirm("Sei sicuro di voler eliminare questa domanda?")) {
      return;
    }
    const response = await fetch(`https://my-shelter-app-backend.onrender.com/questions/${question._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenByLocalStorage}`,
      },
    });
    setIsLoading(true);
    if (response.ok) {
      fetchQuestions()
      alert("Domanda eliminata!");
      setIsLoading(false);
    } else {
      console.error("Errore durante l'eliminazione della domanda:");
      setIsLoading(false);
    }
  };
  //ritorna la data in versione gg/mm/aaaa
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  return (
    <Col xs={8} className="mt-3 ms-2">
      {question.createdBy._id === userData._id &&
        <div className="d-flex align-items-center justify-content-between">
          <p className="fw-medium m-0">Ecco la tua Domanda:</p>
          <div>
            <Button variant="danger" type="button" onClick={handleDelete} disabled={isLoading} style={{ fontSize: 12 }}>
              {isLoading ? 'Eliminazione...' : 'X'}
            </Button>
            {question.answer === "" && <ManageQuestion singleQuestion={question} fetchQuestions={fetchQuestions} />}
          </div>
        </div>}

      <div className="mt-2" style={{ background: "lightgrey", borderRadius: 10, padding: 5 }}>
        <p className="m-0">{question.question}</p>
        <p className="fw-medium m-0" style={{ fontSize: 12 }}>By: <span style={{ color: "grey" }}>{question.createdBy.name}</span> {formatDate(question.date)}</p>
        {!question.answer ? <p className="m-0 fst-italic">Non ci sono ancora risposte</p> : <p className="m-0">{question.answer}</p>}
      </div>
    </Col>
  );
}

export default SingleQuestion;
