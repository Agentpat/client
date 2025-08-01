import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add new post
  const addPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Title and content are required.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/posts", {
        title: newTitle,
        content: newContent,
      });
      setPosts([res.data, ...posts]);
      setNewTitle("");
      setNewContent("");
    } catch {
      alert("Failed to add post");
    }
  };

  // Start editing a post
  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  // Save edited post
  const saveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content are required.");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${editingPostId}`,
        { title: editTitle, content: editContent }
      );
      setPosts(posts.map((p) => (p._id === editingPostId ? res.data : p)));
      cancelEdit();
    } catch {
      alert("Failed to update post");
    }
  };

  // Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete post");
    }
  };

  return (
    <section>
      <h2>Latest Blog Posts</h2>

      {/* New Post Form */}
      <div className="new-post-form">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="input-title"
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="input-content"
        />
        <button onClick={addPost} className="btn-add-post">
          Add Post
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : posts.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => (
            <li key={post._id} className="post-card">
              {editingPostId === post._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="input-content"
                  />
                  <button onClick={saveEdit} className="btn-save-edit">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="btn-cancel-edit">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <button
                    onClick={() => startEdit(post)}
                    className="btn-edit-post"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="btn-delete-post"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogList;
