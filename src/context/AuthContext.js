// AuthContext.js
import { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [userData, setUserData] = useState();
  const [userType, setUserType] = useState()
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = useCallback( async (token, tokenType) => {
    const response = await fetch(`http://localhost:3030/${tokenType}/me`, {
     headers: {
       Authorization: `Bearer ${token}`,
     }})
     if(response.ok){
       const data = await response.json()
        
       setUserData(data);
       setUserType(tokenType)
     } else {
       localStorage.removeItem('token')
       navigate('/signin-and-registration')}
     }, [navigate, setUserType])

     useEffect(() => {
      const currentPath = location.pathname;
      const excludePaths = ['/signin-and-registration', '/registration-shelter'];
      if (!excludePaths.includes(currentPath)) {
        const token = localStorage.getItem('token');
        !token ? navigate('/signin-and-registration'): fetchData(token, jwtDecode(token).type); 
      }
      }, [navigate, fetchData, location.pathname]);

     const login = async (mail, password) => {
         
          const response = await fetch("http://localhost:3030/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mail, password }),
          });
    
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/")
          } else {
            alert("Credenziali errate, riprova!");
          }
         
      };
    
      const logout = () => {
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/signin-and-registration');
      };
      

  return (
    <AuthContext.Provider value={{ userData, login, logout, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext
