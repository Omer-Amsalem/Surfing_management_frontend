import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiBigWave } from "react-icons/gi";
import { FaWind } from "react-icons/fa";

const user = JSON.parse(localStorage.getItem('user') || '{}');

interface Post {
  date: string;
  time: string;
  minimumWaveHeight: number;
  maximumWaveHeight: number;
  description: string;
  photoUrl: string | null; // Correct field name
  createdBy: string;
  likeCount: number;
  commentCount: number;
  participantCount: number;
  averageWindSpeed: number;
}

const Post: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("Fetching Posts...");
    const userAccessToken = user.accessToken;
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/post/futurePosts', {
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
    <div className="p-4 grid grid-cols-1 gap-4">
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
          <p className="text-gray-600">{post.description}</p>
          {post.photoUrl && (
            <img
              src={getPostPhoto(post.photoUrl)}
              alt="Post"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
          )}
          <div className="flex space-x-1 pt-2">
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600">
              Comments ({post.commentCount})
            </button>
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600">
              Like ({post.likeCount})
            </button>
            <button className="bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600">
              Participants ({post.participantCount})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
