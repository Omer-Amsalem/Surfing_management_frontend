import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';
import Header from '../components/Header';


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [user, setUser] = useState<any>(null);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await axios.get('http://localhost:3000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-white shadow-md p-4 flex items-center justify-between">
        <button onClick={() => navigate('/home')} className="text-blue-500 text-lg font-medium flex items-center">
          ⬅ Back
        </button>
        <h1 className="text-xl font-bold">Your Profile</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
          <img src={user.profilePicture || '/path/to/default-picture.jpg'} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-sm bg-white shadow-md rounded-md mt-4 p-4">
        {activeTab === 'profile' && (
          <div className="text-center">
            <img
              src={user.profilePicture || '/path/to/default-picture.jpg'}
              alt="Profile"
              className="w-28 h-28 rounded-full mx-auto mb-4 border-2 border-gray-300"
            />
            <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 text-lg">Team: {user.team}</p>
            <p className="text-gray-600 mt-2 text-lg">About me: {user.description}</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-left text-lg">
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Board High:</strong> {user.boardHigh}</p>
            <p className="mb-2"><strong>Board Volume:</strong> {user.boardVolume}</p>
            <button
              onClick={() => navigate('/edit-profile')}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-lg font-medium"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
