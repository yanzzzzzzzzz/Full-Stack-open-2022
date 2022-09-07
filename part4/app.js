const express = require('express')
const app = express()

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')

const mongoose = require('mongoose')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connect to MongoDB')
  })
  .catch((error) => {
    logger.error('error connect to MongnDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)
module.exports = app