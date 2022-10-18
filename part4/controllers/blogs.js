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

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  console.log(savedBlog);
  response.status(201).json(savedBlog.toJSON());
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
