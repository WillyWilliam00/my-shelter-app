import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function ShelterCard({shelter}) {
   
  
   
  return (
    <Card className='mb-3'style={{height: "13.5rem", overflow: "hidden"}} >
      <Card.Img variant="top" src={shelter.image} />
      <Card.ImgOverlay className='d-flex flex-column justify-content-end align-items-end'>
        <Card.Title className='text-white'>{shelter.shelterName}</Card.Title>
        <Card.Subtitle className="text-white">Distanza: {shelter.distance} km</Card.Subtitle>
        <Card.Subtitle className="text-white">Altitudine: {shelter.altitude} m s.l.m</Card.Subtitle>
        <Button variant="light" type='button'><Link className='text-dark text-decoration-none' to={`/${shelter._id}/?d=${shelter.distance}`}>Scoprilo ora!</Link></Button>
      </Card.ImgOverlay>
      
    </Card>
  );
}

export default ShelterCard;