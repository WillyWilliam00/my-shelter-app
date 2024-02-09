import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import FavoritesContext from '../context/favouriteContext';
import { useState } from 'react';
import { useEffect } from 'react';

function ShelterCard({ shelter }) {

  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext)
  const [liked, setLiked] = useState(false)

  useEffect(() => {//setta come piaciuto (cuore rosso) solo i rifugi all'interno della lista favoriti
    setLiked(favorites.some(favorite => favorite._id === shelter._id))
  }, [favorites, shelter._id])

  const handleFavoriteorRemoveClick = () => {//aggiungi o rimuovi dai preferiti il rifugio
    if (!liked) {
      addFavorite(shelter._id);
    } else {
      removeFavorite(shelter._id);
    }}


  return (
    <Card className='mb-3' style={{ height: "13.5rem", overflow: "hidden" }} >
      <Card.Img variant="top" src={shelter.image} />
      <Card.ImgOverlay className='d-flex flex-column justify-content-end align-items-end'>
        <Card.Title className='text-white'>{shelter.shelterName}</Card.Title>
        <Button onClick={handleFavoriteorRemoveClick} type='button'>{!liked ? "🤍" : "❤️"}</Button>
        <Card.Subtitle className="text-white">Distanza: {shelter.distance} km</Card.Subtitle>
        <Card.Subtitle className="text-white">Altitudine: {shelter.altitude} m s.l.m</Card.Subtitle>
        <Button variant="light" type='button'><Link className='text-dark text-decoration-none' to={`/${shelter._id}/?d=${shelter.distance}`}>Scoprilo ora!</Link></Button>
      </Card.ImgOverlay>

    </Card>
  );
}

export default ShelterCard;