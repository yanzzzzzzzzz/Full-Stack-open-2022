const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const bcrypt = require('bcrypt')

const { authors, books, users } = require('./data')

const addTestData = async () => {
  try {
    await Author.deleteMany({})
    await Book.deleteMany({})
    await User.deleteMany({})
    console.log('add author start')
    const authorMap = {}
    let needAddAuthors = []
    for (let index = 0; index < authors.length; index++) {
      const author = authors[index]
      const findAuthor = await Author.findOne({ name: author.name })
      if (findAuthor === null) {
        needAddAuthors.push(author)
      }
    }
    if (needAddAuthors.length > 0) {
      await Author.insertMany(needAddAuthors)
    }
    const allAuthors = await Author.find({})
    allAuthors.forEach(author => {
      authorMap[author.name] = author._id.toString()
    })
    console.log('add author end')
    console.log('add books start')
    const booksWithAuthorId = books.map(book => ({
      ...book,
      author: authorMap[book.author],
    }))
    await Book.insertMany(booksWithAuthorId)
    console.log('add books end')
    console.log('add user start')
    for (let index = 0; index < users.length; index++) {
      const user = users[index]
      const passwordHash = await bcrypt.hash(user.password, 10)
      await new User({
        username: user.username,
        name: user.name,
        passwordHash: passwordHash,
        favoriteGenre: 'refactoring',
      }).save()
    }
    console.log('add user end')
  } catch (error) {
    console.error('error:', error)
  }
}

module.exports = addTestData
