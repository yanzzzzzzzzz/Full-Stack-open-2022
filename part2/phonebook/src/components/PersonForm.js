const PersonForm = ({addPerson, newPerson, handleNewPersonChange}) => {
    return(
        <div>
        <form onSubmit={addPerson}>
            <div>
            name: 
            <input name="name"
                    value={newPerson.name}
                    onChange={handleNewPersonChange}/>
            </div>
            <div>
            number: 
            <input name="number"
                    value={newPerson.number}
                    onChange={handleNewPersonChange}/>
            </div>
            <div>
                <button type="submit">save</button>
            </div>
        </form>
        </div>
    )
}
  export default PersonForm;