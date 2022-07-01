const Filter = ({filter, setFilterName}) => {
    return (
        <div>
        filter shown with 
        <input value={filter}
                onChange={setFilterName}/>
        </div>
    )
}
export default Filter