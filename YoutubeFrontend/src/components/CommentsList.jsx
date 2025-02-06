import React, { useEffect, useState, useRef } from "react";
import commentService from "../Backend/comment.config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function CommentsList({ videoId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const userId = useSelector((state) => state?.auth?.userData?._id) || null;
  const user = useSelector((state) => state?.auth?.userData) || null;
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!videoId) return;

    commentService
      .getComments(videoId)
      .then((res) => {
        setComments(res.data.data);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [videoId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (editingCommentId) {
      commentService
        .upDateComment(editingCommentId, { newContent: commentText })
        .then((res) => {
          setComments((prev) =>
            prev.map((comment) =>
              comment._id === editingCommentId
                ? { ...comment, content: res.data.data.content }
                : comment
            )
          );
          setEditingCommentId(null);
          setCommentText("");
        })
        .catch((error) => console.error("Error updating comment:", error));
    } else {
      // Add new comment
      commentService
        .postComment({ content: commentText, videoId })
        .then((res) => {
          res.data.data.owner = [{ ...user }];
          setComments((prev) => [...prev, res.data.data]);
          setCommentText("");
        })
        .catch((error) => console.error("Error adding comment:", error));
    }
  };

  const handleOwnerClick = (e) => {
    navigate(`/channelPage/${e.currentTarget.id}/videos`);
  };

  const handleDelete = (commentId) => {
    commentService
      .deleteComment(commentId)
      .then(() => {
        setComments((prev) => prev.filter((item) => item._id !== commentId));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [commentText]);

  const handleUpdate = (commentId) => {
    const commentToEdit = comments.find((item) => item._id === commentId);
    if (!commentToEdit) return;

    setCommentText(commentToEdit.content);
    setEditingCommentId(commentId);
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <div className="bg-gray-900" ref={formRef}>
      <div className="p-4 rounded-lg">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
          <input
            required
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Add a comment..."
          />
          <button type="submit" className="bg-red-600 px-4 py-2 rounded">
            {editingCommentId ? "Update" : "Add"}
          </button>
        </form>

        {/* Display comments */}
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="flex gap-4 p-3 border-b border-gray-700 text-white items-start"
              >
                <img
                  src={comment.owner[0]?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                  id={comment.owner[0]?._id}
                  onClick={handleOwnerClick}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm text-gray-300"
                      id={comment.owner[0]?._id}
                      onClick={handleOwnerClick}
                    >
                      @{comment.owner[0]?.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 font-bold mt-1">
                    {comment.content}
                  </p>
                </div>
                <div>
                  {comment.owner[0]?._id === userId && (
                    <>
                      {editingCommentId === comment._id ? null : (
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          className="text-blue-400 mx-2 hover:text-blue-500"
                        >
                          ✏️
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-red-500 mx-2 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default CommentsList;
