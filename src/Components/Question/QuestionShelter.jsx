import {  Row } from "react-bootstrap"
import SingleQuestion from "./SingleQuestion"

function QuestionShelter({questions, fetchQuestions}){
    
     
    
    return(
        
             <Row>
                {questions.map(((question, i) => (

                    <SingleQuestion key={i} question={question} fetchQuestions={fetchQuestions}/>
                ) ))}
              </Row> 
             
        
    )
}

export default QuestionShelter