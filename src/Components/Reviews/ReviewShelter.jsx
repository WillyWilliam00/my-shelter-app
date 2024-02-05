import { Row } from "react-bootstrap"
import SingleReview from "./SingleReview"

 
 
 
 

function ReviewShelter({reviews, fetchReviews}){
    
     
    
    return(
        <Row>
                {reviews.map(((review, i) => (

                    <SingleReview key={i} review={review} fetchReviews={fetchReviews}/>
                ) ))}
              </Row> 
    )
}

export default ReviewShelter