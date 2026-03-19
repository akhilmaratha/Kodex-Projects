import { useState } from "react";
import "./App.css";

function App() {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [editId, setEditId] = useState(null);

  function handleAddPost(e) {
    e.preventDefault();

    if (postTitle.trim() === "" || postText.trim() === "") {
      alert("Please fill in both title and content");
      return;
    }

    if (editId !== null) {
      const updatedPosts = allPosts.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            title: postTitle,
            content: postText,
          };
        }
        return item;
      });

      setAllPosts(updatedPosts);
      setEditId(null);
    } else {
      const newPost = {
        id: Date.now(),
        title: postTitle,
        content: postText,
      };

      setAllPosts([newPost, ...allPosts]);
    }

    setPostTitle("");
    setPostText("");
  }

  function openEditBox(post) {
    setPostTitle(post.title);
    setPostText(post.content);
    setEditId(post.id);
  }

function removePost(id) {
  const userSaidYes = window.confirm("Do you really want to delete this post?");

  if (!userSaidYes) return;

  const leftPosts = allPosts.filter((item) => item.id !== id);
  setAllPosts(leftPosts);

  if (editId === id) {
    setEditId(null);
    setPostTitle("");
    setPostText("");
  }
}

  function clearForm() {
    setPostTitle("");
    setPostText("");
    setEditId(null);
  }

  return (
    <div className="main-page">
      <div className="post-app">
        <h1>Posting Platform</h1>
        <p className="sub-text">Create, edit and manage your posts easily</p>

        <form className="post-form" onSubmit={handleAddPost}>
          <input
            type="text"
            placeholder="Enter post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />

          <textarea
            rows="5"
            placeholder="Write your post here..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>

          <div className="btn-row">
            <button type="submit">
              {editId !== null ? "Update Post" : "Add Post"}
            </button>

            {editId !== null && (
              <button type="button" className="cancel-btn" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="posts-section">
          <h2>All Posts</h2>

          {allPosts.length === 0 ? (
            <p className="empty-msg">No posts yet. Add your first post.</p>
          ) : (
            allPosts.map((post) => (
              <div className="post-card" key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                <div className="card-btns">
                  <button onClick={() => openEditBox(post)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => removePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;