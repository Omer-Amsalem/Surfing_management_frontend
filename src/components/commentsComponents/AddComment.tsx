import React, { useState } from "react";
import axios from "axios";

interface AddCommentProps {
  postId: string;
  onAddComment: (newComment: {
    _id: string;
    postId: string;
    userId: string;
    content: string;
    timestamp: string;
  }) => void;
  apiUrl: string;
}

const AddComment: React.FC<AddCommentProps> = ({
  postId,
  onAddComment,
  apiUrl,
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/${postId}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const addedComment = response.data.comment;
      onAddComment({
        _id: addedComment.id,
        postId: addedComment.postId,
        userId: addedComment.userId,
        content: addedComment.content,
        timestamp: new Date(addedComment.timestamp).toISOString(),
      });

      setNewComment(""); // Clear the input field
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-2 w-full rounded-lg shadow-md">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
        rows={3}
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white font-bold py-2 w-full rounded-md hover:bg-blue-600 h-10"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Comment"}
      </button>
    </div>
  );
};

export default AddComment;
