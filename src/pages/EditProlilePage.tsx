import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaWater } from "react-icons/fa";
import EditProfile from "../components/EditProfile";

const EditProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

        const response = await axios.get(
          `http://localhost:3000/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
        setError(null);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  // Loading Screen
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

  // Error Screen
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
        <FaWater className="animate-bounce text-blue-500 text-6xl" />
        <p className="mt-4 text-blue-600 text-lg font-semibold">
          Oops! {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <Header pageTitle="Edit Profile" />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <EditProfile
          userPhoto={user.photo }
          firstName={user.firstName || ""}
          lastName={user.lastName || ""}
          description={user.description || "No description provided."}
          email={user.email || ""}
          password={user.password || ""}
          role={user.role || ""}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EditProfilePage;
