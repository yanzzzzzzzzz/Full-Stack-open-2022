import { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherData = ({city}) => {
    const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const [weather, setWeather] = useState([]);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
    useEffect(() =>{
      axios
        .get(url).then((response)=>{
          setWeather(response.data)
        })
    },[])
    return(
      <>
        {weather.main ? (
          <div>
            <h2>weather in {city}</h2>
            <div>Temperature {weather.main.temp}°C</div>
            <img 
              src = {`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            />
            <div>wind {weather.wind.speed} m/s</div>
          </div>
        ) : null}
      </>
    )
  }

export default WeatherData