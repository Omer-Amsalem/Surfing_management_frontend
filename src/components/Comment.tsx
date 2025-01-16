import React from "react";

interface CommentProps {
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  userId,
  content,
  timestamp, 
}) => {
  return (
    <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-md">
      {/* <img
        src={profileImage || "https://via.placeholder.com/100"}
        alt={`${firstName} ${lastName}`}
        className="w-10 h-10 rounded-full object-cover"
      />*/}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800">
            {postId}
          </h4>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        <p className="text-gray-700 mt-2">{content}</p>
      </div>
    </div>
  );
};

export default Comment;
