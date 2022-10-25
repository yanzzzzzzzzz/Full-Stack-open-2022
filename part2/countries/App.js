import { useState, useEffect } from "react";
import axios from "axios";

import CountriesList from "./components/CountriesList";
import CountryInfo from "./components/CountryInfo";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [countriesToShow, setCountriesToShow] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
      setCountriesToShow(response.data);
    });
  }, []);

  const filterListener = (event) => {
    const search = event.target.value;
    setFilter(search);
    const countriesFilterData = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setCountriesToShow(countriesFilterData);
  };
  return (
    <div>
      find countries <input value={filter} onChange={filterListener} />
      {countriesToShow.length === 0 ? (
        <p>The countries that don't exist</p>
      ) : null}
      {countriesToShow.length === 1 ? (
        <CountryInfo country={countriesToShow[0]} />
      ) : null}
      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        <CountriesList
          countriesToShow={countriesToShow}
          setCountriesToShow={setCountriesToShow}
        />
      )}
    </div>
  );
};

export default App;
