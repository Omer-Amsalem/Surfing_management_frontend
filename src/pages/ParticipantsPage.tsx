import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SingleParticipant from "../components/participantsComponents/SingleParticipant";

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
        console.log("Participants response11111:", response.data);

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
      console.log("Updated participants:", updatedParticipants);

      setParticipants(updatedParticipants);

      const isUserInParticipants = updatedParticipants.some(
        (participant: participant) => participant._id === user.id
      );
      setIsJoined(isUserInParticipants);
    } catch (err) {
      console.error("Failed to update participation status:", err);
    }
  };

  if (isLoading) {
    return <div>Loading participants...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Participants" />
      </div>

      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 text-center text-md font-semibold text-gray-800">
        <h3>Total Participants: {participants.length}</h3>
      </div>

      <div className="overflow-y-auto h-[710px] border border-gray-300 rounded-md space-y-4 p-4 min-h-[200px]">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-blue-600 text-lg font-semibold mt-4">
              No participants yet... join us! 🎉
            </p>
          </div>
        ) : (
          participants.map((participant) => (
            <div key={participant._id}>
              <SingleParticipant participant={participant} />
            </div>
          ))
        )}
      </div>

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

      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default ParticipantsPage;
