import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("login error");
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
  };
  const handleCreateNewBlog = async (title, author, url) => {
    console.log("create new blog with ", title, url, author);
    try {
      const blog = await blogService.create({
        title,
        url,
        author,
      });
      console.log("receive:", blog);
      setBlogs(blogs.concat(blog));
    } catch (exception) {
      setErrorMessage("create new blog error");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleUpdateLikes = async (id, blogToUpdate) => {
    try {
      const updateBlogs = await blogService.update(id, blogToUpdate);
      const newBlogs = blogs.map((blog) =>
        blog.id === id ? (blog = updateBlogs) : blog
      );
      console.log("handleUpdateLikes,blog:", newBlogs);
      setBlogs(newBlogs);
    } catch (exception) {
      setErrorMessage("error", exception.response.data.error);
    }
  };

  const handleDeleteBlog = async (id, blogToDelete) => {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      console.log("handleDeleteBlog");
      try {
        blogService.setToken(user.token);
        await blogService.remove(id);
        const newBlogs = blogs.filter((blog) => blog.id !== id);
        setBlogs(newBlogs);
      } catch (exception) {
        setErrorMessage("error", exception.response.data.error);
      }
    }
  };

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </Togglable>
      ) : (
        <div>
          {user.username} logged in
          <input type="button" value="logout" onClick={handleLogout} />
          <h2>create new</h2>
          <Togglable buttonLabel="create">
            <BlogForm createBlog={handleCreateNewBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateLikes={handleUpdateLikes}
                deleteBlog={handleDeleteBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
