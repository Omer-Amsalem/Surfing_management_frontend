// Header Component
import React from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const user = JSON.parse(localStorage.getItem('user') || '{}');

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const navigate = useNavigate();
  const userPhoto = user.userPhoto
    ? `http://localhost:3000/${user.userPhoto}`
    : '/default-avatar.png'; 

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg w-full">
      {/* Add Button for Hosts */}
      {user.isHost && (
        <button
          type="button"
          onClick={() => navigate('/createPost')}
          className="flex items-center space-x-2 text-blue-500 bg-transparent hover:bg-blue-700 hover:text-white p-2 rounded-full transition-all duration-200"
        >
          <CiCirclePlus className="text-white text-3xl" />
        </button>
      )}

      {/* Page Title */}
      <h1 className="flex-grow text-lg font-bold text-center">{pageTitle}</h1>

      {/* User Profile Image */}
      <img
        src={userPhoto}
        alt="User Avatar"
        className="w-12 h-12 rounded-full shadow-md border-2 border-white object-cover"
      />
    </header>
  );
};

export default Header;
