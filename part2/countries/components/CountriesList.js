const CountriesList = ({countriesToShow, setCountriesToShow}) => {
    return(
      <>
      {
        countriesToShow.length != 1 
        ? countriesToShow.map((country)=>(
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={()=>setCountriesToShow([country])}>show</button>
          </div>)) 
        : null 
      }
      </>
    )
}
export default CountriesList