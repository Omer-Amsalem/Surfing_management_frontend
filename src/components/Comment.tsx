import Post from "./Post";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CommentProps {
  firstName: string;
  lastName: string;
  profileImage?: string;
  content: string;
  timestamp: string;
}

const Comment: React.FC<CommentProps> = ({
  firstName,
  lastName,
  profileImage,
  content,
  timestamp,
}) => {
  return (
    <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
      {/* Profile image */}
      <img
        src={profileImage || "https://via.placeholder.com/100"}
        alt={`${firstName}${lastName}`}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Comment content */}
      <div className="flex-1">
        {/* Header: username and timestamp */}
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800">
            {firstName}
            {lastName}
          </h4>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>

        {/* Comment text */}
        <p className="text-gray-700 mt-2">{content}</p>
      </div>
    </div>
  );
};

export default Comment;
