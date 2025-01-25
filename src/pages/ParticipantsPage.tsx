import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SingleParticipant from "../components/participantsComponents/SingleParticipant";
import GenericContainer from "../components/GenericContainer";

type participant = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
};

const ParticipantsPage: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [openRoles, setOpenRoles] = useState<string[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user?.accessToken || "";

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/getParticipants/${postId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (Array.isArray(response.data)) {
          setParticipants(response.data);
          setIsJoined(
            response.data.some(
              (participant: participant) => participant._id === user.id
            )
          );
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (err) {
        console.error("Failed to fetch participants:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [postId, accessToken, user.id]);

  const handleJoinLeave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/post/join/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const updatedParticipants = response.data.participants;

      setParticipants(updatedParticipants);

      const isUserInParticipants = updatedParticipants.some(
        (participant: participant) => participant._id === user.id
      );
      setIsJoined(isUserInParticipants);
    } catch (err) {
      console.error("Failed to update participation status:", err);
    }
  };

  // Group participants by role
  const groupedParticipants = participants.reduce<
    Record<string, participant[]>
  >((acc, participant) => {
    const role = participant.role || "תפקיד לא מוגדר";
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(participant);
    return acc;
  }, {});

  // manage the open roles
  const toggleRole = (role: string) => {
    setOpenRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (isLoading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Participants" />
      </div>
      <GenericContainer>
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 text-center text-md font-semibold text-gray-800">
            <h3>Total Participants: {participants.length}</h3>
          </div>

          {/* Grouped Participants */}
          <div className="p-4 space-y-6">
            {Object.entries(groupedParticipants).map(
              ([role, roleParticipants]) => (
                <div key={role}>
                  {/* Role Header */}
                  <div
                    className="flex justify-between items-center p-4 bg-blue-100 text-blue-900 rounded-lg cursor-pointer shadow-md hover:bg-blue-200 transition-colors"
                    onClick={() => toggleRole(role)}
                    style={{ direction: "rtl" }}
                  >
                    <h3 className="text-lg font-bold">{role}</h3>
                    <span className="text-sm text-gray-700">
                      {roleParticipants.length} משתתפים
                    </span>
                    <span>{openRoles.includes(role) ? "▲" : "▼"}</span>
                  </div>

                  {/* Participants List */}
                  {openRoles.includes(role) && (
                    <div className="mt-2 space-y-4 bg-white p-4 rounded-lg shadow-md">
                      {roleParticipants.map((participant) => (
                        <div key={participant._id} className="p-2">
                          <SingleParticipant participant={participant} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Join/Leave Button */}
        <div className="bg-white p-4 rounded-lg shadow sticky bottom-0">
          <button
            onClick={handleJoinLeave}
            className={`w-full py-2 rounded-md text-white font-bold ${
              isJoined
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isJoined ? "Leave Activity" : "Join Activity"}
          </button>
        </div>
      </GenericContainer>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default ParticipantsPage;
