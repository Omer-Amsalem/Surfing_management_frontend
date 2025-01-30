import React from 'react';
import { IoHome } from 'react-icons/io5';
import { CiCirclePlus } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderButton from './headerComponents/HeaderButton';
import UserProfile from './headerComponents/UserProfile';

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();

  const userPhoto = user.userPhoto
    ? `${import.meta.env.VITE_API_URL}/${user.userPhoto}`
    : '/default-avatar.png';

  return (
    <header className="flex z-100 items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg w-full">
      {location.pathname === '/home' && user.isHost ? (
        <HeaderButton
          onClick={() => navigate('/createPost')}
          icon={<CiCirclePlus className="text-white text-3xl" />}
        />
      ) : location.pathname !== '/home' && (
        <HeaderButton
          onClick={() => navigate('/home')}
          icon={<IoHome className="text-white text-3xl" />}
        />
      )}
      <h1 className="flex-grow text-lg font-bold text-center">{pageTitle}</h1>
      <UserProfile userPhoto={userPhoto} />
    </header>
  );
};

export default Header;
