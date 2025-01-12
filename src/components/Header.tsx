// Header Component
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CiCirclePlus } from 'react-icons/ci';

const user = JSON.parse(localStorage.getItem('user') || '{}');

interface HeaderProps {
  pageTitle: string;
  userPhoto: string;
  isHost: boolean;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, userPhoto, isHost }) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = user.id;
      const token = user.accessToken;

      if (!userId || !token) {
        console.error('User ID or Token is missing in localStorage.');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const getProfileImage = (): string => {
    if (userData?.profilePicture) {
      return userData.profilePicture.startsWith('http')
        ? userData.profilePicture
        : `http://localhost:3000/${userData.profilePicture}`;
    }
    return userPhoto;
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg">
      {/* Add Button for Hosts */}
      {userData?.isHost && (
        <button  type="button"
        className="flex items-center space-x-2 text-blue-500 bg-transparent hover:bg-blue-700 hover:text-white p-2 rounded-full transition-all duration-200">
          <CiCirclePlus className="text-white text-3xl" />
        </button>
      )}
      {/* Page Title */}
      <h1 className="flex-grow text-lg font-bold text-center">{pageTitle}</h1>

      {/* User Profile Image */}
      <img
        src={getProfileImage()}
        alt="User Avatar"
        className="w-12 h-12 rounded-full shadow-md border-2 border-white object-cover"
      />
    </header>
  );
};

export default Header;
