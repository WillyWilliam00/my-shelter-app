// FavoritesContext.js
import React, { createContext, useContext, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import AuthContext from './AuthContext';
import { useLocation } from 'react-router-dom';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { tokenByLocalStorage, userType } = useContext(AuthContext)
  const location = useLocation();
  
  const allFavorite = useCallback(async () => {//ricevi tutti i rifugi preferiti del proprio utente
    const response = await fetch("http://localhost:3030/user/me/favorites", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenByLocalStorage}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setFavorites(data);
    } else {
      console.error("Errore nel fetching dei preferiti:");
    }
  }, [tokenByLocalStorage])

  useEffect(() => {
    const currentPath = location.pathname;
    const excludePaths = ['/signin-and-registration', '/registration-shelter'];
    if (!excludePaths.includes(currentPath) && userType === "user") {//se il type è user avviene allFavorite
      allFavorite()
    }
  }, [allFavorite, location.pathname, userType])

  const addFavorite = async (shelterId) => {//aggiungi un rifugio ai preferiti
    const response = await fetch("http://localhost:3030/user/me/favorites/add", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenByLocalStorage}`
      },
      body: JSON.stringify({ shelterId }),
    });
    const data = await response.json();
    if (response.ok) {
      setFavorites(data)
    } else {
      alert("Non è stato possibile aggiungere questo rifugio ai tuoi preferiti, riprova!");
    }
  };

  const removeFavorite = async (shelterId) => {//rimuovi un rifugio dai preferiti
    const response = await fetch("http://localhost:3030/user/me/favorites/remove", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenByLocalStorage}`
      },
      body: JSON.stringify({ shelterId }),
    });
    const data = await response.json();
    if (response.ok) {
      setFavorites(data)
    } else {
      alert("Non è stato possibile rimuovere questo rifugio ai tuoi preferiti, riprova!");
    }
  };

  const clearFavourite = async () => {//elimina tutti i preferiti
    const response = await fetch("http://localhost:3030/user/me/favorites/clear", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenByLocalStorage}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      alert("Rifugi eliminati!");
      setFavorites(data)
    } else {
      alert("Non è stato possibile rimuovere questo rifugio ai tuoi preferiti, riprova!");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavourite, allFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext
