import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiBigWave, GiWaveSurfer } from "react-icons/gi";
import { FaWind, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { convertToISODate, isRTL, getAccessToken } from "../utils/generalFunctions";
import LikeButton from "./postComponents/LikeButton";

interface Post {
  _id: string;
  date: string;
  time: string;
  minimumWaveHeight: number;
  maximumWaveHeight: number;
  description: string;
  photoUrl: string | null;
  createdBy: string;
  likes: Array<string>;
  comments: Array<string>;
  participants: Array<string>;
  averageWindSpeed: number;
}

interface User {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

interface PostProps {
  apiUrl: string;
}

const Post: React.FC<PostProps> = ({ apiUrl }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const openModal = (imageUrl: string) => setModalImage(imageUrl); // Open modal
  const closeModal = () => setModalImage(null); // Close modal


  useEffect(() => {
    console.log("Fetching Posts...");
    const userAccessToken = user.accessToken;

    const fetchPosts = async () => {

      const accessToken = await getAccessToken(user);

      if (!accessToken) {
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        toast.error("Please log in to continue.");
        navigate('/login');
      }
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        });
        setPosts(response.data);
        fetchUserDetails(response.data.map((post: Post) => post.createdBy));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUserDetails = async (userIds: string[]) => {
      const uniqueUserIds = Array.from(new Set(userIds));
      try {
        const userDetailPromises = uniqueUserIds.map((id) =>
          axios.get(`http://localhost:3000/user/getUser/${id}`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }).then((res) => ({ id, data: res.data }))
        );
        const userDetailsArray = await Promise.all(userDetailPromises);
        const userDetailsMap = userDetailsArray.reduce((acc, { id, data }) => {
          acc[id] = data;
          return acc;
        }, {} as Record<string, User>);
        setUserDetails(userDetailsMap);
      } catch (error) {
        console.error("Error fetching user details:", error);
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
    const accessToken = await getAccessToken(user);
    
    if (!accessToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      toast.error("Please log in to continue.");
      navigate('/login');
    }
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
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 relative"
          >
            {/* User Info */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={'http://localhost:3000/' + userDetails[post.createdBy]?.profilePicture || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <span className="text-gray-700 font-medium text-lg"
                  dir={isRTL(post.description) ? "rtl" : "ltr"}>
                  {userDetails[post.createdBy]?.firstName + ' ' + userDetails[post.createdBy]?.lastName || "Unknown User"}
                </span>
              </div>

              {/* Edit and Delete Buttons */}
              {user.isHost && (
                <div className="flex space-x-6 top-5 right-1">
                  <a
                    onClick={() => navigate(`/updatePost/${post._id}`)}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MdOutlineEdit className="text-2xl" />
                  </a>
                  <a
                    onClick={() => handleDelete(post._id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <MdDelete className="text-2xl" />
                  </a>
                </div>
              )}
            </div>

            {/* Post Details */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-750">
                Session Date: {convertToISODate(post.date)} at: {post.time}
              </p>
            </div>
            <div className="text-gray-700 space-y-3">
              <p className="flex items-center">
                <GiBigWave className="mr-2 text-blue-500 text-xl" />
                Wave Height: {post.minimumWaveHeight}-{post.maximumWaveHeight} meter
              </p>
              <p className="flex items-center">
                <FaWind className="mr-2 text-blue-500 text-xl" />
                Average Wind Speed: {post.averageWindSpeed} km/h
              </p>
            </div>

            {/* Description */}
            <p
              className={`text-gray-600 text-sm ${isRTL(post.description) ? "text-right" : "text-left"}`}
              dir={isRTL(post.description) ? "rtl" : "ltr"}
            >
              {post.description}
            </p>

            {/* Post Photo */}
            <div className="flex justify-center">
              {post.photoUrl && (
                <img
                  src={getPostPhoto(post.photoUrl)}
                  alt="Post"
                  className="w-1/2 h-64 object-cover rounded-lg border border-gray-300"
                  onClick={() => openModal(getPostPhoto(post.photoUrl))}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-around items-center pt-4 border-t border-gray-200">
              <a
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                onClick={() => navigate(`/comments/${post._id}`)}
              >
                <FaComment className="text-2xl" />
                <span>{post.comments.length}</span>
              </a>
              <LikeButton
                postId={post._id}
                likes={post.likes}
                userId={user.id}
                apiUrl="http://localhost:3000/post/like"
                onLikeUpdate={(updatedLikes) => {
                  // Update the post's likes in the parent component's state
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p._id === post._id ? { ...p, likes: updatedLikes } : p
                    )
                  );
                }}
              />
              <a
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500"
                onClick={() => navigate(`/participants/${post._id}`)}
              >
                <GiWaveSurfer className="text-2xl" />
                <span>{post.participants.length}</span>
              </a>
            </div>
            {modalImage && (
              <div
                className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-100 backdrop-blur-sm"
                onClick={closeModal}
              >
                <div className=" p-4 rounded-lg relative">
                  <img src={modalImage} alt="Modal" className="max-w-full max-h-screen" />
                  <button
                    className="absolute top-2 right-2 bg-gray-300 rounded-full p-2"
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
