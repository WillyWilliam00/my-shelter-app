import { Col, Container, Row, Tab, Nav } from "react-bootstrap";
import RegistrationUser from "./RegistrationUser";
import Signin from "./Signin";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";


function InitialTab() {
  const [key, setKey] = useState('first');
 
  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        <Col xs={12} md={6} >
          <div>
            {/* Contenuto che cambia in base alla scheda selezionata */}
            <h2 className="mx-auto" style={{ width: "fit-content" }}>{key === "first" ? "Accedi a MyShelter!" : "Iscriviti a MyShelter!"}</h2>
            {key === "first" ?
              <p>Sei un Esploratore o hai un Rifugio? Accedi!</p> :
              <p>Non sei ancora un Esploratore? Iscrivi qui!</p>}
            <Tab.Container id="signin-or-registration" activeKey={key} onSelect={(k) => setKey(k)}>
              <Row>
                <Col sm={12}>
                  <Nav justify variant="pills" className="flex-row">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Accedi</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Registrati</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={12}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <Signin/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <RegistrationUser />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </Col>
        <Col xs={12} md={6} className="background-Login">
        </Col>
      </Row>
    </Container>

  )

}

export default InitialTab;