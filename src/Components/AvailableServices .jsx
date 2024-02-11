import React from 'react';
import {Badge } from 'react-bootstrap';
import { FaWheelchair, FaBed, FaDog, FaToilet, FaWifi, FaMapMarkedAlt, FaTree, FaCar } from 'react-icons/fa';



function AvailableServices({ services }) {// Definisce un array di oggetti per ogni servizio con il suo stato, icona e label
    const serviceItems = [
        { key: 'accessibility', icon: <FaWheelchair size={25} />, label: 'Accessibilità' },
        { key: 'accommodation', icon: <FaBed size={25} />, label: 'Alloggio' },
        { key: 'dogsAllowed', icon: <FaDog size={25} />, label: 'Animali ammessi' },
        { key: 'toilets', icon: <FaToilet size={25} />, label: 'Toilette' },
        { key: 'wifi', icon: <FaWifi size={25} />, label: 'Wi-Fi Gratuito' },
        { key: 'guidedTours', icon: <FaMapMarkedAlt size={25} />, label: 'Attività Guidate' },
        { key: 'picnicArea', icon: <FaTree size={25} />, label: 'Area Picnic' },
        { key: 'parking', icon: <FaCar size={25} />, label: 'Parcheggio disponibile' },
    ];

    return (

        serviceItems.map(({ key, icon, label }) => (

            <Badge key={key} bg={services[key] ? "success" : "secondary"} className={`m-2 ${services[key] ? '' : 'text-muted'} fs-5` }
                style={{ opacity: services[key] ? '1' : '0.5' }}>
                {icon} {label}
            </Badge>

        ))

    )

}
export default AvailableServices


