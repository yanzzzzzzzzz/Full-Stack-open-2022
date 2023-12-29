import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_AUTHOR_BIRTHYEAR, GET_ALL_AUTHORS } from '../queries'
import Dropdown from './Dropdown'

const SetBirthyear = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [updateBirthYear] = useMutation(UPDATE_AUTHOR_BIRTHYEAR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
    onError: (error) => {
      console.log('error', error)
    },
  })
  const submit = (event) => {
    event.preventDefault()
    //update
    updateBirthYear({ variables: { name: name, setBornTo: parseInt(born) } })
    //clear
    setName('')
    setBorn('')
  }
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <Dropdown
            selectOption={name}
            options={authors}
            onSelectChange={setName}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetBirthyear
