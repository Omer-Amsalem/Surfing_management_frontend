import React, { useEffect, useState } from "react";
import axios from "axios";

interface SingleParticipantProps {
  userId: string;
}

const SingleParticipant: React.FC<SingleParticipantProps> = ({ userId }) => {
  const [participant, setParticipant] = useState({
    firstName: "",
    lastName: "",
    profilePicture: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user?.accessToken || "";

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUser/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const { firstName, lastName, profilePicture, role } = response.data;
        setParticipant({ firstName, lastName, profilePicture, role });
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [userId, accessToken]);

  const fullProfilePictureUrl = participant.profilePicture
    ? `http://localhost:3000/${participant.profilePicture}`
    : "/images/surfer.png";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <p>Loading participant...</p>
      </div>
    );
  }

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
