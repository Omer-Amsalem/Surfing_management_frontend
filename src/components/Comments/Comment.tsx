import React, { useEffect, useState, memo } from "react"; // memo is used to prevent re-rendering of the component
import axios from "axios";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";

interface CommentProps {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedContent: string) => void;
}

const Comment: React.FC<CommentProps> = memo(
  ({ _id, userId, content, timestamp, onDelete, onEdit }) => {
    const [userDetails, setUserDetails] = useState({
      firstName: "",
      lastName: "",
      profilePicture: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/getUser/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );

          const { firstName, lastName, profilePicture } = response.data;
          setUserDetails({ firstName, lastName, profilePicture });
        } catch (err) {
          console.error("Failed to fetch user details:", err);
          setError("Failed to load user details.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }, [userId, user.accessToken]);

    // Handle loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <p>Loading user details...</p>
        </div>
      );
    }

    // Handle error state
    if (error) {
      return (
        <div className="flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    const formattedTimestamp = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));

    const fullProfilePictureUrl = userDetails.profilePicture
      ? `http://localhost:3000/${userDetails.profilePicture}`
      : "/images/surfer.png";

    return (
      <div className="bg-blue-50 bg-opacity-50 p-4 rounded-lg shadow-sm border border-gray-200 max-w-full">
        {/* Top section: User details */}
        <div className="flex items-start space-x-4 border-b border-gray-100 pb-2">
          {/* Profile picture */}
          <img
            src={fullProfilePictureUrl}
            alt={`${userDetails.firstName} ${userDetails.lastName}`}
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />

          {/* Username and timestamp */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-blue-600">
                {userDetails.firstName} {userDetails.lastName}
              </h4>
              <span className="text-sm text-gray-400">
                {formattedTimestamp}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            {user.id === userId && (
              <>
                <EditComment
                  commentId={_id}
                  currentContent={content}
                  onEdit={onEdit}
                  apiUrl="http://localhost:3000/comment/update"
                />
                <DeleteComment
                  _id={_id}
                  onDelete={onDelete}
                  apiUrl="http://localhost:3000/comment/delete"
                />
              </>
            )}
          </div>
        </div>

        {/* Bottom section: Comment content */}
        <div className="mt-2">
          <p className="text-gray-700 break-words overflow-wrap-anywhere word-break-break-word">
            {content}
          </p>
        </div>
      </div>
    );
  }
);

export default Comment;
