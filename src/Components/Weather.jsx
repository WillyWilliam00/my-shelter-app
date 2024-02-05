import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

function Weather({coordinates}) {

    const[weather, SetWeather] = useState()

   useEffect(() => {

    const apiKey = '5f369eb1f8e3409c87c182101242901';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${coordinates.lat},${coordinates.lng}&days=5&lang=it`;
   fetch(url)
   .then(r => r.json())
   .then(SetWeather)
   .catch(error => console.error("Error fetching shelter data:", error));
   }, [coordinates])
 

   const getDayName = (dateStr, locale) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
};

    return (
        !weather ? <h4>Loading...</h4> : (
            <><h3>Meteo</h3>
            <Container>
                
            {weather.forecast.forecastday.map((day, index) => (
                <Row key={day.date} style={{borderBlockEnd: "1px solid grey"}}>
                    
                    <Col xs={2} className="d-flex align-items-center">
                    <p style={{textTransform: "capitalize"}} className="m-0">{index === 0 ? 'Oggi' : getDayName(day.date, "it-IT")}:</p>
                    </Col>
                    <Col xs={10} className="d-flex justify-content-evenly align-items-center">
                    <img src={day.day.condition.icon} alt={day.day.condition.text}/>
                    <div>
                    <p className="m-0">{day.day.avgtemp_c}°C</p>
                    <p className="m-0">{day.day.mintemp_c}°C</p>
                    </div>
                    <p className="m-0">{day.day.avghumidity}%</p>
                    </Col>
                </Row>
            ))}
        Powered by <a href="https://www.weatherapi.com/" title="Weather API">WeatherAPI.com</a>
            </Container>
            </>
        )
    )
}

export default Weather