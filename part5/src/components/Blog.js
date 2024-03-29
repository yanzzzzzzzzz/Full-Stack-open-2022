import { useState } from "react";
const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleUpdateLikes = async (event) => {
    event.preventDefault();
    console.log("click handleUpdateLikes");
    console.log("blog:", blog);
    updateLikes(blog.id, {
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
      author: blog.author,
      user: blog.user.id,
    });
  };
  const handleDeleteBlog = async () => {
    console.log("click handleDeleteBlog");
    deleteBlog(blog.id, blog);
  };
  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
        {visible && (
          <div className="blog-details">
            <div className="blog-url">{blog.url}</div>
            <div className="likes">
              likes:{blog.likes}
              <button onClick={handleUpdateLikes}>likes</button>
            </div>
            <div>{blog.author}</div>
            {blog.user.username === user.username && (
              <div>
                <button id="remove" onClick={handleDeleteBlog}>
                  remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
