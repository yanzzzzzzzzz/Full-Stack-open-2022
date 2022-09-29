const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  
  if(blog.url!=null && blog.title!=null && blog.author!=null)
  {
    try {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog)
    } catch(exception) {
      next(exception)
    }
  }
  else
  {
    response.status(400).json(blog)
  }
 
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
  } catch (exception){
    next(exception)
  }
})

module.exports = blogsRouter