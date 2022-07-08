import WeatherData from "./WeatherData"
const CountryInfo = ({country}) => {
    return(
        <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <p>Languages:</p>
        <ul>
            {Object.values(country.languages).map(languages => (
            <li key={languages}>{languages}</li>
            ))}
        </ul>
        <img src={country.flags.png} alt={`${country.name.common} flag`} />
        <WeatherData city = {country.capital[0]} />
        </div>
    )
}
export default CountryInfo