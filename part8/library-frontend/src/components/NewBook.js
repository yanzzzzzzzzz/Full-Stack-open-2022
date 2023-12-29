import { useState } from 'react'
const NewBook = (props) => {
  const [title, setTitle] = useState('12345')
  const [author, setAuthor] = useState('Robert Martin')
  const [published, setPublished] = useState('1911')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(['refactoring'])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    props.createBook({
      variables: { title, published: parseInt(published), author, genres },
    })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
