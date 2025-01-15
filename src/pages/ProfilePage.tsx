
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileSummary from "../components/ProfileSummary";
import { FaWater } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);

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

      const response = await axios.get(`http://localhost:3000/user/getUser/${userId}`,
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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Your profile" />
      </div>

      {/* Profile Summary */}
      <div className="flex-grow bg-white shadow-md rounded-lg max-w-md mx-auto w-full p-4">
        <ProfileSummary
          userPhoto={`http://localhost:3000/${user.profilePicture}`}
          firstName={user.firstName}
          lastName={user.lastName}
          team={user.role}
          description={user.description}
        />
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white shadow-md">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
