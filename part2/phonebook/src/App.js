import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newPerson, setNewPerson] = useState({ name:"", number:""})
  const [filterName, setFilterName] = useState('')
  const addPerson = (event) =>{
    event.preventDefault()
    const isDuplicate = persons.some(person => {
      if (person.name === newPerson.name) {
        return true;
      }
  
      return false;
    })
    if(isDuplicate){
      alert(newPerson.name + ' is already added to phonebook')
    }
    else
    {
      setPersons(persons.concat(newPerson))
      console.log('button clicked', event.target)
    }
    setNewPerson({name:"",number:""})
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value)
  }
  const handleNewPersonChange = (event) =>{
    const {name, value} = event.target
    console.log("name:", name," value:",value)
    setNewPerson({...newPerson, [name]: value})
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} setFilterName={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} 
                  newPerson={newPerson} 
                  handleNewPersonChange={handleNewPersonChange}/>      
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName}/>
    </div>
  )
}

export default App