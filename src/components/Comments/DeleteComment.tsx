import axios from "axios";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface DeleteCommentProps {
  _id: string;
  apiUrl: string;
  onDelete: (id: string) => void; // Function to update the state of the parent component
}

const DeleteComment: React.FC<DeleteCommentProps> = ({
  _id,
  onDelete,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setLoading(true);

    try {
      await axios.delete(`${apiUrl}/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      toast.success("Comment deleted successfully.");
      onDelete(_id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-comment">
      <button
        className={`delete-comment-button border rounded-md p-1 bg-transparent hover:bg-blue-100 transition duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? (
          "Deleting..."
        ) : (
          <FaTrash className="text-gray-500 hover:text-red-500 text-sm" />
        )}
      </button>
    </div>
  );
};

export default DeleteComment;
