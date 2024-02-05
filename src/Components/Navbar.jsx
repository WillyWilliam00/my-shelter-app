 import { useContext } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
 import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


function MyNav() {

  const { userData, userType, logout } = useContext(AuthContext)
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary px-2">
       
      <Navbar.Brand href="#">
            <img
              alt="MyShelterLogo.jpg"
              src= "images/MyShelterLogo.jpg"
              width="70"
              height="70"
              className="d-inline-block align-top"
            />{' '}
          
          </Navbar.Brand>
           <Nav>
            {userData ? 
              <Link to={"/"} className='nav-link'>Home</Link> :
              <><Nav.Link>Funzioni</Nav.Link>
              <Link to={"/registration-shelter"}className='nav-link'>Hai un rifugio?</Link></>}
           </Nav>
          
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          
          
            {userData ? 
             <>
            {userType === "user" && <Nav.Link href="/">I Miei Preferiti</Nav.Link>}
            <NavDropdown  title={userType === "user" ? userData.name : userData.owner.firstName} id="basic-nav-dropdown" align="end">
            <NavDropdown.Item href="#action/3.1">Il Mio Profilo</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={logout}>
              Esci 
            </NavDropdown.Item>
            </NavDropdown></>
             : 
              <Button><Link to="/SigninandRegistration" style={{color: "white", textDecoration: "none"}}>Accedi o Registrati</Link></Button>
               }
              
          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

export default MyNav;