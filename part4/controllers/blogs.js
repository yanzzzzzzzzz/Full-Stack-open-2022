const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const config = require("../utils/config");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blogs = await Blog.findById(request.params.id);
  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const user = request.user;

  const blog = new Blog({
    url: request.body.url,
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes ? request.body.likes : 0,
    user: user._id,
  });
  if (blog.url != null && blog.title != null && blog.author != null) {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog);
  } else {
    response.status(400).json(blog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "delete user not create user" });
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { title, url, author, likes } = request.body;
  const updateBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: likes ? likes : 0, title: title, url: url, author: author },
    { new: true, runValidators: true, context: "query" }
  );
  response.json(updateBlog);
});

module.exports = blogsRouter;
