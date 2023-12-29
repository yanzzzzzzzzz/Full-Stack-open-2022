const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const { UserInputError, AuthenticationError } = require('apollo-server-errors')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const JWT_SECRET = process.env.SECRET
const DataLoader = require('dataloader')

// 創建一個資料加載器，負責批量載入作者的書籍數量
const bookCountLoader = new DataLoader(async authorIds => {
  // 在這裡執行一次性的查詢，檢索所有作者的書籍數量
  const bookCounts = await Book.aggregate([
    { $match: { author: { $in: authorIds } } },
    { $group: { _id: '$author', count: { $sum: 1 } } },
  ])

  // 將結果映射到對應的作者
  const countsMap = {}
  bookCounts.forEach(result => {
    countsMap[result._id] = result.count
  })

  // 返回對應作者的書籍數量
  return authorIds.map(authorId => countsMap[authorId] || 0)
})
const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const conditions = {}
      if (args.genre) {
        conditions.genres = { $in: [args.genre] }
      }
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })
        conditions.author = foundAuthor.id
      }
      const result = await Book.find(conditions).populate('author', {
        name: 1,
        born: 1,
      })
      return result
    },
    allAuthors: async () => {
      const authors = await Author.find()
      return authors.map(author => ({
        name: author.name,
        bookCount: bookCountLoader.load(author._id),
      }))
    },
    me: (root, args, { currentUser }) => {
      return currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      console.log('args', args)
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      if (args.title.length < 5) {
        throw new UserInputError('Title must be at least 5 characters long.', {
          invalidArgs: ['args.title'],
        })
      }
      const foundAuthor = await Author.findOne({ name: args.author })
      const book = await new Book({
        ...args,
        author: foundAuthor,
      })
      const savedBook = await book.save()

      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })

      return savedBook
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const updateAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      )
      return updateAuthor
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      })

      return user.save().catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
