import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

function Weather({ coordinates, name }) {

    const [weather, SetWeather] = useState()
    const apiKey = process.env.REACT_APP_WEATHER_API;
    useEffect(() => {//scarica i dati del meteo in base alle coordinate 
        
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${coordinates.lat},${coordinates.lng}&days=5&lang=it`;
        fetch(url)
            .then(r => r.json())
            .then(SetWeather)
            .catch(error => console.error("Error fetching shelter data:", error));
    }, [coordinates, apiKey])

    const getDayName = (dateStr, locale) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'long' });
    };

    return (
        !weather ? <h4>Loading...</h4> : (
            <><h5>Che tempo fa in <span className="baseColor fw-bold">{name}?</span></h5>
                <Container>
                    {weather.forecast.forecastday.map((day, index) => (
                        <Row key={day.date} style={{ borderBlockEnd: "1px solid darkgreen" }}>
                            <Col xs={2} className="d-flex align-items-center">
                                <p style={{ textTransform: "capitalize" }} className="m-0 fw-bold">{index === 0 ? 'Oggi' : getDayName(day.date, "it-IT")}:</p>
                            </Col>
                            <Col xs={10} className="d-flex justify-content-evenly align-items-center">
                                <img src={day.day.condition.icon} alt={day.day.condition.text} />
                                <div>
                                    <p className="m-0">{day.day.avgtemp_c}°C</p>
                                    <p className="m-0">{day.day.mintemp_c}°C</p>
                                </div>
                                <p className="m-0">{day.day.avghumidity}% 💧</p>
                            </Col>
                        </Row>
                    ))}
                    <p className="m-0" style={{fontSize: 10}}>Powered by <a href="https://www.weatherapi.com/" title="Weather API">WeatherAPI.com</a></p>
                    
                </Container>
            </>
        )
    )
}

export default Weather