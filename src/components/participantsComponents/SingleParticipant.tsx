import { useNavigate } from "react-router-dom";
import { isRTL } from "../../utils/generalFunctions";

interface SingleParticipantProps {
  participant: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  };
}

const SingleParticipant: React.FC<SingleParticipantProps> = ({
  participant,
}) => {
  const navigate = useNavigate();
  const fullProfilePictureUrl = participant.profilePicture
    ? `http://localhost:3000/${participant.profilePicture}`
    : "/images/surfer.png";

  return (
    <div className="flex flex items-center p-2 w-full bg-white shadow-sm rounded-lg border border-gray-300">
      {/* Participant Info */}
      <div className="flex-1 ml-4 text-left">
        <h4 className="text-sm font-semibold text-blue-600">
          {participant.firstName} {participant.lastName}
        </h4>
      </div>

         {/* Profile Picture */}
         <img
        src={fullProfilePictureUrl}
        alt={`${participant.firstName} ${participant.lastName}`}
        className="w-8 h-8 rounded-full border border-gray-300 object-cover cursor-pointer hover:scale-110 hover:shadow-lg transition-transform duration-200"
        onClick={() => navigate(`/profile/${participant._id}`)}
      />
    </div>
  );
};

export default SingleParticipant;
