const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')

const addTestData = require('./util')
const User = require('./models/User')
const mongoose = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config()
const JWT_SECRET = process.env.SECRET
const MONGODB_URI = process.env.MONGODB_URI
const needResetData = false
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connect')
  } catch (error) {
    console.error('error:', error)
  }
}

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '',
    }
  )

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      try {
        let currentUser = null

        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
          currentUser = await User.findById(decodedToken.id)
        }

        return { currentUser }
      } catch (error) {
        console.log('error', error)
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
connectToMongoDB()
if (needResetData) {
  addTestData()
}
