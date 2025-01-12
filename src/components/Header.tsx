// Header Component
import React, { useEffect, useState } from 'react';
import axios from 'axios';


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

      if (!userId || !token) return;
      console.log("Hellooossss");
      try {
        const response = await axios.get(`http://localhost:3000/user/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
    console.log("USer Data", userData); 
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-blue-500 text-white shadow-md">
      {isHost && (
        <button className="text-2xl font-bold text-white bg-blue-700 w-10 h-10 flex items-center justify-center rounded-full">
          +
        </button>
      )}
      <h1 className="text-lg font-semibold flex-grow text-center">{pageTitle}</h1>
      {userData ? (
        <img src={`http://localhost:3000/${userData}`} alt="User" className="w-10 h-10 rounded-full" />
      ) : (
        <img src={userPhoto} alt="User" className="w-10 h-10 rounded-full" />
      )}
    </header>
  );
};

export default Header;