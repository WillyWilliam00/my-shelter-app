import { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userData, setUserData] = useState();
  const [userType, setUserType] = useState()
  const location = useLocation();
  const navigate = useNavigate();
  const tokenByLocalStorage = localStorage.getItem('token')


  //restituisce i dati del proprio profilo
  // se la fetch non va a buon fine il localStorage viene ripulito e l'utente riportato al login 
  const fetchData = useCallback(async (token, tokenType) => {
    const response = await fetch(`http://localhost:3030/${tokenType}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (response.ok) {
      const data = await response.json()
      setUserData(data); //setta i dati dell'utente
      setUserType(tokenType) //setta il tipo di token (user o shelter)
    } else {
      setUserData(null)//lo useState data diventa null
      localStorage.removeItem('token') //rimuove il token non valido dal localStorage
      navigate('/signin-and-registration')
    }
  }, [navigate, setUserType])

  //ad ogni render controlla se l'utente non si trova nelle rotte registrazione/login
  // - se il token è presente tenta di codificarlo, se la decodifica fallisce(il token non ha la sintassi corretta pulisce gli state e riporta
  // l'utente nel login tramite blocco catch)
  // se la decodifica riesce avviene fetchData
  useEffect(() => {
    const currentPath = location.pathname;
    const excludePaths = ['/signin-and-registration', '/registration-shelter'];
    if (!excludePaths.includes(currentPath)) {
      if (tokenByLocalStorage) {
        try {
          const tokenDecripted = jwtDecode(tokenByLocalStorage)
          fetchData(tokenByLocalStorage, tokenDecripted.type);
        } catch (error) {
          console.error('Invalid token specified:', error);
          localStorage.removeItem('token'); //  rimuovere il token non valido
          navigate('/signin-and-registration'); // Reindirizza l'utente verso la pagina di login
        }
      } else {
        navigate('/signin-and-registration');
      }
    }
  }, [navigate, fetchData, location.pathname, tokenByLocalStorage]);

  const login = async (mail, password) => {// recupera i dati in e fai loggare l'utente
    const response = await fetch("http://localhost:3030/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token)
      navigate("/")
    } else {
      alert("Credenziali errate, riprova!");
    }
  };

  const logout = () => {//slogga l'utente
    localStorage.removeItem('token');
    setUserData(null);
    setUserType(null)
    navigate('/signin-and-registration');
  };

  return (
    <AuthContext.Provider value={{ userData, login, logout, userType, tokenByLocalStorage, fetchData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext
