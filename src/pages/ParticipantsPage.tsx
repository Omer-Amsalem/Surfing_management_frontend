import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SingleParticipant from "../components/participantsComponents/SingleParticipant";

const ParticipantsPage: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user?.accessToken || "";

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/getById/${postId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("response", response);

        const postParticipants = response.data.participants;
        setParticipants(postParticipants);

        // Check if the user is already joined
        setIsJoined(postParticipants.includes(user.id));
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
      console.log("user.id", user.id);
      console.log("accessToken", accessToken);
      const response = await axios.post(
        `http://localhost:3000/post/join/${postId}`,
        {},

        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("response", response);

      setParticipants(response.data.participants);

      // Update the `isJoined` state based on the updated participants
      setIsJoined(response.data.participants.includes(user.id));
    } catch (err) {
      console.error("Failed to update participation status:", err);
    }
  };

  if (isLoading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Participants" />
      </div>

      <div className="participant-count">
        <h3>Total Participants: {participants.length}</h3>
      </div>

      {/* Participants List */}
      <div className="overflow-y-auto h-[720px] border border-gray-300 rounded-md space-y-4 p-4">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-blue-600 text-lg font-semibold mt-4">
              No participants yet... join us! 🎉
            </p>
          </div>
        ) : (
          participants.map((userId) => (
            <div
              key={userId}
              className="flex items-center p-4 bg-white shadow-sm rounded-lg border border-gray-300"
            >
              <SingleParticipant userId={userId} />
            </div>
          ))
        )}
      </div>

      {/* Join/Leave Button */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
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

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default ParticipantsPage;
