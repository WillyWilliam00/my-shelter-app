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
      <div className='imgHover'><Card.Img variant="top" src={shelter.image} /></div>
      <Card.ImgOverlay className='d-flex flex-column justify-content-between'>
        <div>
        <Card.Title className=''>{shelter.shelterName}</Card.Title>
        <Card.Subtitle className="fs-6">Distanza: {shelter.distance}km 🛣️</Card.Subtitle>
        <Card.Subtitle className="fs-6">Altitudine: {shelter.altitude} m s.l.m 🏔️</Card.Subtitle>
        </div>
        <div className='ms-auto'>
        <Button variant="light" type='button' className='me-3 buttonScopriloOra'><Link to={`/${shelter._id}/?d=${shelter.distance}`}>Scoprilo ora!</Link></Button>
        <Button onClick={handleFavoriteorRemoveClick} type='button'>{!liked ? "🤍" : "❤️"}</Button>
        </div>
      </Card.ImgOverlay>

    </Card>
  );
}

export default ShelterCard;