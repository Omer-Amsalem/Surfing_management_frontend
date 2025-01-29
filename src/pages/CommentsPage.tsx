import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Comment from "../components/commentsComponents/Comment";
import AddComment from "../components/commentsComponents/AddComment";
import { useParams } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import GenericContainer from "../components/GenericContainer";

interface CommentType {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

const CommentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/comment/postId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        setComments(response.data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to fetch comments.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, user.accessToken]);

  const handleAddComment = (newComment: CommentType) => {
    console.log("handleAddComment called with:", newComment);
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleEditComment = (id: string, updatedContent: string) => {
    console.log("handleEditComment called with:", { id, updatedContent });
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === id ? { ...comment, content: updatedContent } : comment
      )
    );
  };  
  
  const handleDeleteComment = (commentId: string) => {
    console.log("handleDeleteComment called with:", commentId);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Comments" />
      </div>
      <GenericContainer>
        <div className="flex flex-col space-y-4 mt-4 mb-2">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center ">
              <FaComments className="text-blue-400 text-6xl animate-bounce" />
              <p className="text-blue-600 text-lg font-semibold mt-4">
                No comments yet... say something cool! 💬 🌊
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment._id}
                _id={comment._id}
                postId={comment.postId}
                userId={comment.userId}
                content={comment.content}
                timestamp={comment.timestamp}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
              />
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="sticky bottom-0 bg-white shadow-md">
          <AddComment
            postId={id!}
            onAddComment={handleAddComment}
            apiUrl="http://localhost:3000/comment/create"
          />
        </div>
      </GenericContainer>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default CommentsPage;
