
interface SingleParticipantProps {
  participant: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  };
}

const SingleParticipant: React.FC<SingleParticipantProps> = ({ participant }) => {

  const fullProfilePictureUrl = participant.profilePicture
    ? `http://localhost:3000/${participant.profilePicture}`
    : "/images/surfer.png";

  return (
    <div className="flex items-center p-2 w-full bg-white shadow-sm rounded-lg border border-gray-300">
      {/* Profile Picture */}
      <img
        src={fullProfilePictureUrl}
        alt={`${participant.firstName} ${participant.lastName}`}
        className="w-8 h-8 rounded-full border border-gray-300 object-cover"
      />

      {/* Participant Info */}
      <div className="flex-1 ml-4 text-left">
        <h4 className="text-sm font-semibold text-blue-600">
          {participant.firstName} {participant.lastName}
        </h4>
        <p className="text-xs text-gray-500">
          <span className="font-bold">Role/Team:</span> {participant.role}
        </p>
      </div>
    </div>
  );
};

export default SingleParticipant;
