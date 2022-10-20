const NewBlog = ({
  handleSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author:
          <input type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url:
          <input type="text" value={url} onChange={handleUrlChange} />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  );
};
export default NewBlog;
