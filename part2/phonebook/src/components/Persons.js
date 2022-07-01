const Persons = ({persons, filterName}) => {
    return(
      <div>
      {persons.filter((p) => p.name.toLowerCase().includes(filterName.toLowerCase()))
        .map(person =>
        <Person key={person.name} name={person.name} number={person.number}/>
      )}
      </div>
    )
}
const Person = ({name, number}) =>{
    return(
        <p>{name} {number}</p>
    )
}
export default Persons