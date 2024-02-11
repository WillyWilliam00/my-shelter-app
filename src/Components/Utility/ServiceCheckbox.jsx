import { Col, Form } from "react-bootstrap";
import { FaWifi, FaMapMarkedAlt, FaTree, FaCar, FaBed, FaToilet, FaWheelchair, FaDog } from 'react-icons/fa';

function ServiceCheckbox({ service, label, onChange, isChecked }) { //icone specifiche per ogni tipo di servizio, associando un'icona a un nome di servizio
  const serviceIcons = {
    accommodation: <FaBed />,
    toilets: <FaToilet />,
    accessibility: <FaWheelchair />,
    animalsAllowed: <FaDog />,
    wifi: <FaWifi />,
    guidedTours: <FaMapMarkedAlt />,
    picnicArea: <FaTree />,
    parking: <FaCar />
  }
// Renderizza una casella di controllo con l'icona e la label corrispondenti al servizio fornito
  // Il componente è reso riutilizzabile tramite le props: `service`, `label`, `onChange`, `isChecked`
  // `service` identifica il tipo di servizio, `label` è la descrizione testuale del servizio,
  // `onChange` è la funzione da eseguire quando lo stato del checkbox cambia,
  // e `isChecked` indica se il checkbox è selezionato o meno.
  return (
    <Col xs={6}>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id={`checkbox-${service}`}
          label={
            <>
              {serviceIcons[service]} {' '}{label}
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
