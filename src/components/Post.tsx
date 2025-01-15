import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiBigWave } from "react-icons/gi";
import { FaWind } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const user = JSON.parse(localStorage.getItem('user') || '{}');

interface Post {
  id: string
  date: string;
  time: string;
  minimumWaveHeight: number;
  maximumWaveHeight: number;
  description: string;
  photoUrl: string | null; 
  createdBy: string;
  likeCount: number;
  comments: Array<string>;
  participants: Array<string>;
  averageWindSpeed: number;
}

interface PostProps {
  apiUrl: string; 
}

const Post: React.FC<PostProps> = ({apiUrl}) => {
  const navigate =useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("Fetching Posts...");
    const userAccessToken = user.accessToken;
    const fetchPosts = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const getPostPhoto = (photoUrl: string | null): string => {
    if (photoUrl) {
      return photoUrl.startsWith('http')
        ? photoUrl
        : `http://localhost:3000/${photoUrl.replace(/\\/g, '/')}`; // Replace backslashes
    }
    return '/images/default-photo.jpg'; // Fallback image
  };

  return (
    <div className="p-4 grid grid-cols-1 gap-4 flex-col-md">
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-2"
        >
          <div className="text-sm text-gray-500 font-medium text-left">
            Session Date: {new Date(post.date).toLocaleDateString()} {post.time}
          </div>
          <p className="text-gray-700 font-medium text-left">
            <GiBigWave className="mr-2 text-blue-500 text-xl inline" />
            Wave Height: {post.minimumWaveHeight}-{post.maximumWaveHeight} meter
          </p>
          <p className="text-gray-700 font-medium text-left">
            <FaWind className="mr-2 text-blue-500 text-xl inline" />
            Average Wind Speed: {post.averageWindSpeed} km/h
          </p>
          <p className="text-gray-600 text-right">{post.description}</p>
          {post.photoUrl && (
            <img
              src={getPostPhoto(post.photoUrl)}
              alt="Post"
              className="w-100 h-70 object-fil rounded-lg border border-gray-300 mr-auto ml-auto"
            />
          )}
          <div className="flex-col-md space-x-2 space-y-1 pt-2">
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600"
            onClick={() => navigate(`/comments/${post.id}`)}>
              Comments ({post.comments.length})
            </button>
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600">
              Like ({post.likeCount})
            </button>
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600">
              Participants ({post.participants.length})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
