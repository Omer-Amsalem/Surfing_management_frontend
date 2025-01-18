import React, { useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

interface EditCommentProps {
  commentId: string;
  currentContent: string;
  apiUrl: string;
  onEdit: (id: string, updatedContent: string) => void; // function to update the state of the parent component
}

const EditComment: React.FC<EditCommentProps> = ({
  commentId,
  currentContent,
  onEdit,
  apiUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(currentContent);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSave = async () => {
    if (!newContent.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/${commentId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
  
      console.log("response", response);
      
      if (response.status === 200) {
        toast.success("Comment updated successfully.");
        onEdit(commentId, newContent); 
        setIsEditing(false); 
      } else {
        throw new Error("Unexpected response status.");
      }
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Failed to update comment.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
            rows={2}
          />
          <button
            onClick={!loading ? handleSave : undefined}
            className="bg-blue-500 text-white font-bold py-1 px-3 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)} // enable editing mode
          className="border rounded-md p-1 bg-transparent  transition duration-200"
        >
          <FaEdit className="text-gray-500 hover:text-blue-500 text-lg"/>
        </button>
      )}
    </div>
  );
};

export default EditComment;
