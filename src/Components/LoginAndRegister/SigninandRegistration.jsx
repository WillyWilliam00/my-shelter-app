import { Col, Container, Row, Tab, Nav } from "react-bootstrap";
import RegistrationUser from "./RegistrationUser";
import Signin from "./Signin";
import { useState } from "react";
import classNames from "classnames";


function InitialTab() {
  const [key, setKey] = useState('first');

  return (
    <Container fluid>
      <Row style={{ height: "100vh" }}>
        <Col xs={12} md={6} >
          <div>
            {/* Contenuto che cambia in base alla scheda selezionata */}
            <h2 className="fw-bold mx-auto fitContent Loginh2" >{key === "first" ? "Accedi a MyShelter!" : "Iscriviti a MyShelter!"}</h2>
            {key === "first" ?
              <p className= "mx-auto fitContent">Sei un Esploratore o hai un Rifugio?<strong> Accedi!</strong></p> :
              <p className="mx-auto fitContent">Non sei ancora un Esploratore?<strong> Iscriviti qui!</strong></p>}
            <Tab.Container id="signin-or-registration" activeKey={key} onSelect={(k) => setKey(k)}>
              <Row className="mx-auto mt-4">
                <Col sm={12}>
                  <Nav justify variant="pills" className="flex-row">
                    <Nav.Item  className="m-2">
                      <Nav.Link eventKey="first" className="fw-bold fs-3" >Accedi</Nav.Link>
                    </Nav.Item>
                    <Nav.Item  className="m-2">
                      <Nav.Link eventKey="second" className="fw-bold fs-3">Registrati</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={key === "first" ? 6 : 12} className="mx-auto">
                  <Tab.Content>
                    <Tab.Pane eventKey="first" className={classNames(key === "first" && "loginBox" )}>
                      <Signin />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second" className={classNames(key === "second" && "loginBox" )}>
                      <RegistrationUser />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </Col>
        <Col xs={12} md={6} className="background-Login phoneBackGround">
        </Col>
      </Row>
    </Container >

  )

}

export default InitialTab;