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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header pageTitle="Comments" />

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 p-4">
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

      {/* Add Comment Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        {/* Add new comment functionality can go here */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CommentsPage;
