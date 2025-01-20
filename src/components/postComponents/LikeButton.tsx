import React, { useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa6";
import { toast } from "react-toastify";

interface LikeButtonProps {
  postId: string; // Post ID
  likes: string[]; // Array of user IDs who liked the post
  userId: string; // Current user's ID
  apiUrl: string; // API URL for like/unlike
  onLikeUpdate: (updatedLikes: string[]) => void; // Callback to update likes in the parent component
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  likes,
  userId,
  apiUrl,
  onLikeUpdate,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(likes.includes(userId));
  const [likeCount, setLikeCount] = useState<number>(likes.length);

  const handleLikeToggle = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user.accessToken);
    try {
      const response = await axios.post(
        `${apiUrl}/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const updatedLikes = response.data.likes;

      setIsLiked(updatedLikes.includes(userId));
      setLikeCount(updatedLikes.length);
      onLikeUpdate(updatedLikes); // Notify the parent component of the updated likes
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like. Please try again.");
    }
  };

  return (
    <a
      className={`flex items-center space-x-2 ${
        isLiked ? "text-red-500" : "text-gray-700"
      }`}
      onClick={handleLikeToggle}
    >
      <FaHeart className="text-2xl" />
      <span>{likeCount}</span>
    </a>
  );
};

export default LikeButton;
