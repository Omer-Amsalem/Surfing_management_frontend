import React, { useState } from 'react';
import { CiUser, CiLogout } from 'react-icons/ci';

import { BsChatDots } from "react-icons/bs";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  userPhoto: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userPhoto }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const Logout = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/user/logout`,
          {
            token: user.refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Logged out successfully.");
      } catch (error) {
        toast.error("Failed to log out. Please try again.");
      }
    };

    Logout();
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
    navigate('/login');
  };

  return (
    <div className="relative">
      <img
        src={userPhoto}
        alt="User Avatar"
        className="w-12 h-12 rounded-full shadow-md border-2 border-white object-cover cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-800">
          <ul className="py-2">
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <CiUser className="mr-2" /> Profile
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => navigate('/chatBot')}
            >
              <BsChatDots className="mr-2" /> Chat with Kelly
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={handleLogout}
            >
              <CiLogout className="mr-2" /> Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
