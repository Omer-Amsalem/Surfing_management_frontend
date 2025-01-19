import React, { useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

interface EditCommentProps {
  commentId: string;
  currentContent: string;
  apiUrl: string;
  onEdit: (id: string, updatedContent: string) => void; // function to update the parent component's state
}

const EditComment: React.FC<EditCommentProps> = ({
  commentId,
  currentContent,
  apiUrl,
  onEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // state to toggle the modal
  const [newContent, setNewContent] = useState(currentContent); // state to store the updated content
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSave = async () => {
    if (loading) return;

    if (!newContent.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${apiUrl}/${commentId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          }
        }
      );

      toast.success("Comment updated successfully.");
      if (onEdit){
        onEdit(commentId, newContent); // Update the parent component's state
      }
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Failed to update comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="border rounded-md p-1 bg-transparent hover:bg-blue-100 transition duration-200"
      >
        <FaEdit className="text-gray-500 hover:text-blue-500 text-lg" />
      </button>

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Comment</h2>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
              rows={4}
            />
            <div className="flex justify-end space-x-2 mt-4">
              {/* Save Button */}
              <button
                onClick={handleSave}
                className={`border rounded-md px-4 py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setNewContent(currentContent); // reset content to original
                  setIsModalOpen(false); // close the modal
                }}
                disabled={loading}
                className="border rounded-md px-4 py-2 bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditComment;
