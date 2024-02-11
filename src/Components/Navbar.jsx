import { useContext } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


function MyNav() {

  const { userData, userType, logout } = useContext(AuthContext)

  return (
    userData && (
      <Navbar expand="lg" className="">
      <Navbar.Brand href="#">
        <img
          alt="MyShelterLogo.jpg"
          src="images/MyShelterLogo.png"
          width="70"
          height="70"
        className='imgLogoNav'
        />{' '}
      </Navbar.Brand>
      <Nav>
        {userData ?
          <Link to={"/"} className='nav-link home'>{userType === "user" ? "Home 🏠" : "Il Tuo Rifugio 🏔️"}</Link> :
          <><Nav.Link>Funzioni</Nav.Link>
            <Link to={"/registration-shelter"} className='nav-link'>Hai un rifugio? 🏔️</Link></>}
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {userData ?
            <>
              {userType === "user" ?
                <Link to={"/favorite-shelters"} className='nav-link navLinkMobile me-5 '>I Miei Preferiti 🩷</Link> :
                <Link to={"/me"} className='nav-link navLinkMobile me-2' >Modifica il tuo rifugio ⚙️</Link>
              }
              <NavDropdown title={userType === "user" ? userData.name : userData.owner.firstName} id="basic-nav-dropdown" align="end" className='me-2 navLinkLogOut'>
                <NavDropdown.Item onClick={logout}>
                  Esci
                </NavDropdown.Item>
              </NavDropdown></>
            :
            <Button><Link to="/SigninandRegistration" style={{ color: "white", textDecoration: "none" }}>Accedi o Registrati</Link></Button>
          }

        </Nav>
      </Navbar.Collapse>

    </Navbar>
  )
    
  )
}

export default MyNav;