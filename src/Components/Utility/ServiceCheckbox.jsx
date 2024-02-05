import { Col, Form } from "react-bootstrap";


function ServiceCheckbox({ service, label, imgSrc, onChange, isChecked }) {

    
    return (
        
         <Col xs={6}>
         <Form.Group className="mb-3">
        <Form.Check 
          type="checkbox"
          id={`checkbox-${service}`}
          label={
            <>
              <img src={imgSrc} alt={label} width="75" height="75" />
              {' '}{label}
            </>
          }
          checked={isChecked}
          onChange={() => onChange(service)}
        />
      </Form.Group>
      </Col>
      
       
    );
  }

  export default ServiceCheckbox
  