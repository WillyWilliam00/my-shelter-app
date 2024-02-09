import './App.css';
import MyNav from './Components/Navbar.jsx';
import { Routes, Route } from 'react-router-dom';
import SigninandRegistration from './Components/LoginAndRegister/SigninandRegistration.jsx';
import RegistrationShelter from './Components/LoginAndRegister/RegistrationShelter.jsx';
import { AuthProvider } from './context/AuthContext.js';
import Main from './Components/Main.jsx';
import SingleShelter from './Components/SingleShelter.jsx';
import { FavoritesProvider } from './context/favouriteContext.js';
import FavoriteShelters from './Components/FavoriteShelter.jsx';
import ManageProfile from './Components/ManageProfile.jsx';

function App() {


  return (

    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<><MyNav /><Main /></>} />
          <Route path="/landing" />
          <Route path="/signin-and-registration" element={<SigninandRegistration />} />
          <Route path='/registration-shelter' element={<RegistrationShelter />} />
          <Route path='/favorite-shelters' element={<><MyNav /><FavoriteShelters /></>} />
          <Route path="/me" element={<><MyNav /><ManageProfile /></>} />
          <Route path="/:id" element={<><MyNav /><SingleShelter /></>} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>


  )
}

export default App;
