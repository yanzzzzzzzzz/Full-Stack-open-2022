import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = ({ setToken, setPage, show }) => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('authors')
    }
  }, [result.data]) // eslint-disable-line

  const [username, setUsername] = useState('root')
  const [password, setPassword] = useState('123')
  if (!show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()
    await login({ variables: { username, password } })
  }
  return (
    <form onSubmit={submit}>
      <div>
        name{' '}
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type='submit'>login</button>
    </form>
  )
}
export default LoginForm
