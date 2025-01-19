import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Comment from "../../components/Comments/Comment";
import { useParams } from "react-router-dom";
import { FaComments } from "react-icons/fa";

interface CommentType {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
  onDelete: (id: string) => void
}

const CommentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.accessToken) {
      setError("User is not authenticated. Please login.");
      setLoading(false);
      return;
    }

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
        setError("Failed to fetch comments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, user.accessToken]);

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

      const addedComment = response.data.comment;
      setComments((prev) => [
        ...prev,
        {
          _id: addedComment.id,
          postId: addedComment.postId,
          userId: addedComment.userId,
          content: addedComment.content,
          timestamp: new Date(addedComment.timestamp).toISOString(),
          onDelete: (id: string) => handleDelete(id)
        },
      ]);
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment._id !== id));
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Comments" />
      </div>

      {/* Comments List */}
      <div className="overflow-y-auto h-[630px] border border-gray-300 rounded-md space-y-4 p-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
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
              onDelete={handleDelete}
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
