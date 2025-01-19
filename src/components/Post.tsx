import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiBigWave, GiWaveSurfer } from "react-icons/gi";
import { FaWind, FaComment } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {convertToISODate} from "../utils/generalFunctions";

interface Post {
  _id: string;
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

const Post: React.FC<PostProps> = ({ apiUrl }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [apiUrl]);

  const getPostPhoto = (photoUrl: string | null): string => {
    if (photoUrl) {
      return photoUrl.startsWith("http")
        ? photoUrl
        : `http://localhost:3000/${photoUrl.replace(/\\/g, "/")}`; // Replace backslashes
    }
    return "/images/default-photo.jpg"; // Fallback image
  };

  const handleDelete = async (postId: string) => {
    try {
      const userAccessToken = user.accessToken;
      await axios.delete(`http://localhost:3000/post/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-1/3 grid grid-cols-1 gap-4 flex-col-md">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-2 relative"
          >
            {/* Edit Button - Visible only for Hosts */}
            {user.isHost && (
              <div className="absolute top-5 right-4 flex space-x-4 space-x-5">
                <a
                  onClick={() => navigate(`/updatePost/${post._id}`)}
                  className="cursor-pointer"
                >
                  <MdOutlineEdit className="text-gray-500 hover:text-blue-700 transition-colors text-2xl" />
                </a>
                <a
                  onClick={() => handleDelete(post._id)}
                  className="bg-transparent p-0 cursor-pointer"
                >
                  <MdDelete className="text-gray-500 hover:text-red-500 transition-colors text-2xl" />
                </a>
              </div>
            )}
            <div className="text-sm text-gray-500 font-medium text-left">
              Session Date: {convertToISODate(post.date)} at {post.time}
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
                className="w-60 h-64 object-cover rounded-lg border border-gray-300 mr-auto ml-auto"
              />
            )}
            <div className="flex justify-center items-center space-x-8 pt-4">
              <p
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 text-2xl cursor-pointer"
                onClick={() => navigate(`/comments/${post._id}`)}
              >
                <FaComment className="text-3xl" /> <span>{post.comments.length}</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 text-2xl">
                <BiSolidLike className="text-3xl" /> <span>{post.likeCount}</span>
              </p>
              <p className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 text-2xl">
                <GiWaveSurfer className="text-3xl" /> <span>{post.participants.length}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
