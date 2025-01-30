import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileSummary from "../components/ProfileSummary";
import { FaWater } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("No user data found in localStorage");
      }

      const user = JSON.parse(userData);
      const token = user.accessToken;
      const userId = user.id;
    

      if (!token || !userId) {
        throw new Error("No token or user ID found");
      }
      console.log("user id", id);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    };

    fetchUserData().catch((error) => {
      console.error("Error fetching user data:", error.message);
    });
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <FaWater className="animate-bounce text-blue-500 text-6xl" />
        <p className="mt-4 text-blue-600 text-lg font-semibold">
          Riding the waves... Loading your profile 🌊
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Profile" />
      </div>

      {/* Profile Summary */}
        <ProfileSummary
          urlid={id ? id : ""}
          userPhoto={`${import.meta.env.VITE_API_URL}/${user.profilePicture}`}
          firstName={user.firstName}
          lastName={user.lastName}
          team={user.role}
          description={user.description}
          email={user.email}
          boardHigh={user.boardHigh}
          boardvol={user.boardv}
        />
      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
