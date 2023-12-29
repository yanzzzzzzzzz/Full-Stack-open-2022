import BookTable from './BookTable'
import { USER } from '../queries'
import { useQuery } from '@apollo/client'
const Recommend = ({ show, books }) => {
  const userResult = useQuery(USER)
  if (!show) {
    return null
  }
  const genre = userResult.data?.me.favoriteGenre || []

  return (
    <div>
      <h1>recommendations</h1>
      <div>
        books in your favorite genre <b>{genre}</b>
      </div>
      <BookTable books={books.filter((book) => book.genres.includes(genre))} />
    </div>
  )
}
export default Recommend
