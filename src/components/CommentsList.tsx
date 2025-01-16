import React from "react";
import Comment from "./Comment";

interface CommentListProps {
  comments: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    content: string;
    timestamp: string;
  }[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center">No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <Comment
            key={index}
            firstName={comment.firstName}
            lastName={comment.lastName}
            profileImage={comment.profileImage}
            content={comment.content}
            timestamp={comment.timestamp}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
