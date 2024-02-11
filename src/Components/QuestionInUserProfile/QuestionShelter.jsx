import { Row } from "react-bootstrap"
import SingleQuestion from "./SingleQuestion.jsx"

//lista tutte le domande
function QuestionShelter({ questions, fetchQuestions }) {
    return (
        <Row style={{height: "30vh", overflow: "auto"}}>
            {questions.map(((question, i) => (
                <SingleQuestion key={i} question={question} fetchQuestions={fetchQuestions} />
            )))}
        </Row>
    )
}

export default QuestionShelter