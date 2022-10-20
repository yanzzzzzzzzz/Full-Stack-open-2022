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
  const body = request.body;
  const user = request.user;

  const blog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  }).populate("user", { username: 1, name: 1 });
  if (blog.url != null && blog.title != null && blog.author != null) {
    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog.toJSON());
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
  const blog = request.body;
  const id = request.params.id;

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  updatedBlog
    ? response.status(200).json(updatedBlog.toJSON())
    : response.status(404).end();
});

module.exports = blogsRouter;
