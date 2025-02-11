import { useNavigate } from "react-router-dom";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";

interface CommentProps {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  content: string;
  timestamp: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedContent: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  _id,
  userId,
  content,
  timestamp,
  onDelete,
  onEdit,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const formattedTimestamp = new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));

  const fullProfilePictureUrl = userId.profilePicture
    ? `${import.meta.env.VITE_API_URL}/${userId.profilePicture}`
    : "/images/default-avatar.png";

  return (
    <div className="bg-blue-50 bg-opacity-50 p-4 rounded-lg shadow-sm border border-gray-300 max-w-full">
      {/* Top section: User details */}
      <div className="flex items-start space-x-4 border-b border-gray-300 pb-2">
        {/* Profile picture */}
        <img
          onClick={() => navigate(`/profile/${userId._id}`)}
          src={fullProfilePictureUrl}
          alt={`${userId.firstName} ${userId.lastName}`}
          className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer hover:scale-110 hover:shadow-lg transition-transform duration-200"
        />

        {/* Username and timestamp */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-blue-600">
              {userId.firstName} {userId.lastName}
            </h4>
            <span className="text-sm text-gray-400">{formattedTimestamp}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          {user.id === userId._id && (
            <>
              <EditComment
                commentId={_id}
                currentContent={content}
                onEdit={onEdit}
                apiUrl={`${import.meta.env.VITE_API_URL}/comment/update`}
              />
              <DeleteComment
                _id={_id}
                onDelete={onDelete}
                apiUrl={`${import.meta.env.VITE_API_URL}/comment/delete`}
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
};

export default Comment;
