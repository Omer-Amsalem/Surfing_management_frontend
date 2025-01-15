import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 
import { toast } from "react-toastify";
import { convertToISODate } from "../utils/generalFunctions";

const user = JSON.parse(localStorage.getItem("user") || "{}");

const UpdatePostPage: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    minimumWaveHeight: "",
    maximumWaveHeight: "",
    averageWindSpeed: "",
    description: "",
    photo: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect non-hosts to the homepage
  if (!user || !user.isHost) {
    navigate("/");
    return null;
  }

  // Fetch Post Data
  useEffect(() => {
    const fetchPostData = async () => {
      const userAccessToken = user.accessToken;
      console.log("Fetching Post Data...", id);
      try {
        const response = await axios.get(`http://localhost:3000/post/getById/${id?.toString()}`, {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        });
  
        const postData = response.data;  
        // Convert date to ISO format
        const formattedDate = postData.date ? convertToISODate(postData.date) : "";
  
        setFormData({
          date: formattedDate,
          time: postData.time || "", // Default to empty if time is missing
          minimumWaveHeight: postData.minimumWaveHeight?.toString() || "",
          maximumWaveHeight: postData.maximumWaveHeight?.toString() || "",
          averageWindSpeed: postData.averageWindSpeed?.toString() || "",
          description: postData.description || "",
          photo: null, // No file here initially
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast.error("Failed to fetch post data. Please try again.");
      }
    };
  
    fetchPostData();
  }, [id, navigate]);
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.date ||
      !formData.time ||
      !formData.minimumWaveHeight ||
      !formData.maximumWaveHeight ||
      !formData.averageWindSpeed ||
      !formData.description
    ) {
      toast.error("All fields are required!");
      return;
    }

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("date", formData.date);
    formDataToSend.append("time", formData.time);
    formDataToSend.append("minimumWaveHeight", formData.minimumWaveHeight);
    formDataToSend.append("maximumWaveHeight", formData.maximumWaveHeight);
    formDataToSend.append("averageWindSpeed", formData.averageWindSpeed);
    formDataToSend.append("description", formData.description);

    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }
    console.log("Form Data", formDataToSend);
    try {
      const response = await axios.put(`http://localhost:3000/post/update/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });     
      toast.success("Post updated successfully!");
      navigate(`/home`); 
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header pageTitle="Update Post" />
      <main className="flex-grow p-6 bg-gray-100">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Time:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Minimum Wave Height (m):</label>
              <input
                type="number"
                name="minimumWaveHeight"
                value={formData.minimumWaveHeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Maximum Wave Height (m):</label>
              <input
                type="number"
                name="maximumWaveHeight"
                value={formData.maximumWaveHeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Average Wind Speed (km/h):</label>
              <input
                type="number"
                name="averageWindSpeed"
                value={formData.averageWindSpeed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Photo:</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating Post..." : "Update Post"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatePostPage;
