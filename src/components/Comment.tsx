import React, { useEffect, useState } from "react";
import axios from "axios";

interface CommentProps {
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

const Comment: React.FC<CommentProps> = ({ userId, content, timestamp }) => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        console.log("User details response:", response.data);

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
  }, [userId]);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

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
            <span className="text-sm text-gray-400">{formattedTimestamp}</span>
          </div>
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
};

export default Comment;
