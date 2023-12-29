import BookTable from './BookTable'

const Books = ({ books, show, genre, setGenre }) => {
  if (!show) {
    return null
  }
  const genres = [
    'refactoring',
    'agile',
    'patterns',
    'design',
    'crime',
    'classic',
    'all genres',
  ]

  return (
    <div>
      <h2>books</h2>
      {genre === 'all genres' ? (
        <BookTable books={books} />
      ) : (
        <>
          <div>
            in genre <b>{genre}</b>
          </div>
          <BookTable books={books} />
        </>
      )}
      {genres.map((val) => (
        <button
          key={val}
          onClick={() => setGenre(val === 'all genres' ? '' : val)}
        >
          {val}
        </button>
      ))}
    </div>
  )
}

export default Books
