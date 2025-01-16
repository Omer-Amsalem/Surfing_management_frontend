import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Comment from "../components/Comment";
import { useParams } from "react-router-dom";

interface CommentType {
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

const CommentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract post ID from the URL
  const [comments, setComments] = useState<CommentType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState<string>("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchComments = async () => {
      console.log(id);
      try {
        const response = await axios.get(
          `http://localhost:3000/comment/postId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        setComments(response.data);
      } catch (err) {
        setError("Failed to fetch comments.");
        console.error(err);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, user.accessToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/comment/create/${id}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      // Add the new comment to the state
      const addedComment = response.data;
      setComments((prevComments) => [...prevComments, addedComment]);

      // Clear the input field
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError("Failed to add comment.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Comments" />
      </div>

      {/* Comments List */}
      <div className="overflow-y-auto h-[630px] border border-gray-300 rounded-md space-y-4 p-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet.</p>
        ) : (
          comments.map((comment, index) => (
            <Comment
              key={index}
              postId={comment.postId}
              userId={comment.userId}
              content={comment.content}
              timestamp={comment.timestamp}
            />
          ))
        )}
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow">
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
        >
          Add Comment
        </button>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default CommentsPage;
