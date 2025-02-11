import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { GiBigWave, GiWaveSurfer } from "react-icons/gi";
import { FaWind, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { isRTL } from "../utils/generalFunctions";
import LikeButton from "./postComponents/LikeButton";
import { getAccessToken } from "../utils/generalFunctions";
import { SlCalender } from "react-icons/sl";
import Loader from "./genericComponents/Loader";
import { getFuturePost, getUserPosts } from "../utils/generalFunctions";


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
  from: string;
}

const Post: React.FC<PostProps> = ({ from }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<Record<string, User>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const fetchPosts = async () => {
    if (!hasMore) return;

    const accessToken = await getAccessToken(user);
    if (!accessToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    try {
      let response; 

      if (from === "Home") {
        response = await getFuturePost(page, 10);
      } else if (from === "Profile") {
        response = await getUserPosts(page, 10);
      }

      if (!response) return; 

      setPosts((prevPosts) => {
        const postIds = new Set(prevPosts.map((p) => p._id));
        const newPosts = response.data.posts.filter((post: Post) => !postIds.has(post._id));
        return [...prevPosts, ...newPosts];
      });
      setHasMore(response.data.hasMore);


      fetchUserDetails(response.data.posts.map((post: Post) => post.createdBy));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const fetchUserDetails = async (userIds: string[]) => {
    const uniqueUserIds = Array.from(new Set(userIds));
    try {
      const userDetailPromises = uniqueUserIds.map((id) =>
        axios
          .get(`${import.meta.env.VITE_API_URL}/user/getUser/${id}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          })
          .then((res) => ({ id, data: res.data }))
      );
      const userDetailsArray = await Promise.all(userDetailPromises);
      const userDetailsMap = userDetailsArray.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {} as Record<string, User>);
      setUserDetails(userDetailsMap);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !hasMore) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const getPostPhoto = (photoUrl: string | null): string => {
    if (photoUrl) {
      return photoUrl.startsWith("http")
        ? photoUrl
        : `${import.meta.env.VITE_API_URL}/${photoUrl.replace(/\\/g, "/")}`;
    }
    return '/images/default-avatar.png';
  };

  function formatPostDateAndTime(date: string, time: string): string {
    const formattedDate = new Intl.DateTimeFormat("he-IL", {
      dateStyle: "short",
    }).format(new Date(date));

    return `${formattedDate} , ${time}`;
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/post/delete/${postId}`, {
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

  if (isLoading) {
    return <Loader message="Riding the waves... Loading posts 🌊" />
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
        {posts.map((post, index) => (
          <div
            key={index}
            ref={index === posts.length - 1 ? lastPostRef : null}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 relative"
          >
            {/* User Info */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    userDetails[post.createdBy]?.profilePicture
                      ? `${import.meta.env.VITE_API_URL}/${userDetails[post.createdBy]?.profilePicture}`
                      : '/images/default-avatar.png'
                  }
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  onClick={() => navigate(`/profile/${post.createdBy}`)}
                />
                <span className="text-gray-700 font-medium text-lg">
                  {userDetails[post.createdBy]?.firstName} {userDetails[post.createdBy]?.lastName}
                </span>
              </div>
              {/* Edit and Delete Buttons */}
              {user.isHost && (
                <div className="flex space-x-2 top-5 right-1 sm:space-x-6 md:space-x-6">
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

            {/* Session Details (Added Back) */}
            <p className="flex items-center text-gray-750">
              <SlCalender className="mr-2 text-blue-500 text-xl" />
              <span className="font-medium">
                Session Date: {formatPostDateAndTime(post.date, post.time)}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <GiBigWave className="text-blue-500 text-xl" />
              <span className="font-medium">
                Wave Height: {post.minimumWaveHeight}-{post.maximumWaveHeight} meters
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaWind className="text-blue-500 text-xl" />
              <span className="font-medium">
                Average Wind Speed: {post.averageWindSpeed} km/h
              </span>
            </p>

            {/* Post Description */}
            <p className={`text-gray-600 text-sm ${isRTL(post.description) ? "text-right" : "text-left"}`} dir={isRTL(post.description) ? "rtl" : "ltr"}>
              {post.description}
            </p>

            {/* Post Photo */}
            <div className="flex justify-center">
              {post.photoUrl && (
                <img
                  src={getPostPhoto(post.photoUrl)}
                  alt="Post"
                  className="w-1/2 h-64 object-cover rounded-lg border border-gray-300 cursor-pointer"
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
                apiUrl={`${import.meta.env.VITE_API_URL}/post/like`}
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
                  <img
                    src={modalImage}
                    alt="Modal"
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
                  />
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
