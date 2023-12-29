import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { GET_ALL_BOOKS, CREATE_BOOK, BOOK_ADDED } from './queries'
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from '@apollo/client'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [genre, setGenre] = useState(null)
  const client = useApolloClient()
  const booksResult = useQuery(GET_ALL_BOOKS, { variables: { genre } })
  const books = booksResult.data?.allBooks || []
  const [createBook] = useMutation(CREATE_BOOK)
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      try {
        window.alert(`${addedBook.title} added`)
        updateCache(
          client.cache,
          { query: GET_ALL_BOOKS, variables: { genre: '' } },
          addedBook,
        )
      } catch {
        console.log('error')
      }

      client.cache.updateQuery(
        { query: GET_ALL_BOOKS, variables: { genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(addedBook),
          }
        },
      )
    },
  })

  const logout = () => {
    setToken(null)
    setPage('login')
    localStorage.clear()
    client.resetStore()
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === null ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books
        show={page === 'books'}
        books={books}
        genre={genre}
        setGenre={setGenre}
      />

      {token === null ? (
        <LoginForm
          setToken={setToken}
          setPage={setPage}
          show={page === 'login'}
        />
      ) : (
        <></>
      )}
      <NewBook show={page === 'add'} createBook={createBook} />
      <Recommend show={page === 'recommend'} books={books} />
    </div>
  )
}

export default App
