import './App.css';
import MyNav from './Components/Navbar.jsx';
import { Routes, Route } from 'react-router-dom';
import SigninandRegistration from './Components/LoginAndRegister/SigninandRegistration.jsx';
import RegistrationShelter from './Components/LoginAndRegister/RegistrationShelter.jsx';
import { AuthProvider } from './context/AuthContext.js';  
import Main from './Components/Main.jsx';
import SingleShelter from './Components/SingleShelter.jsx';
 
function App() {
  
  return (
   
   <AuthProvider>
    <Routes>
      <Route path="/" element={<><MyNav/><Main/></>}/>
      <Route path="/landing"/>
      <Route path="/signin-and-registration" element={<><MyNav/><SigninandRegistration/></>}/>
      <Route path='/registration-shelter' element={<RegistrationShelter/>}/>
      <Route path="/me"/>
      <Route path="/:id"element={<><MyNav/><SingleShelter/></>}/>
    </Routes>
  </AuthProvider>
   

  )
}

export default App;
