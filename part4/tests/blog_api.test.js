const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("test data save in dataset and get length", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific title is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);

    expect(titles).toContain("React patterns");
  });
});

describe("verifies property name", () => {
  test("blogs have id property named id instead of _id", async () => {
    const blogsAtEnd = await helper.blogsInDb();
    const ids = blogsAtEnd.map((blog) => blog.id);

    for (const id of ids) {
      expect(id).toBeDefined();
    }
  });
});

describe("viewing a specific blog", () => {
  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "123";

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a new blog", () => {
  let token = null;
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("1234", 10);
    const user = await new User({ username: "test", passwordHash }).save();

    const userToken = { username: "test", id: user.id };
    return (token = jwt.sign(userToken, config.SECRET));
  });
  test("succeeds with valid data", async () => {
    const newBlog = {
      url: "https://reactpatterns.com/",
      likes: 10,
      author: "123",
      title: "this is a blog",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("missing likes property from the request will default to 0 and can be added", async () => {
    const newBlog = {
      title: "test add",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likes = blogsAtEnd.map((r) => r.likes);
    expect(likes).toContain(0);
  });

  test("missing title or url property from the request will response 400 bad request", async () => {
    const newBlog = {
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe("deletion of a blog", () => {
  let token = null;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("1234", 10);
    const user = await new User({ username: "test", passwordHash }).save();

    const userToken = { username: "test", id: user.id };
    token = jwt.sign(userToken, config.SECRET);

    const createblog = {
      title: "test add",
      author: "test add",
      url: "https://google.com/",
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(createblog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    return token;
  });
  test("a blog can be deleted", async () => {
    const blogsAtStart = await Blog.find({}).populate("user");

    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({}).populate("user");

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("deletion of a blog", () => {
  test("a blog can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.title = "update";

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).toContain(blogToUpdate.title);
  });
});

afterAll(() => {
  Blog.deleteMany({});
  mongoose.connection.close();
});
